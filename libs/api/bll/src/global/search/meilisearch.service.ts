/* eslint-disable unicorn/no-array-method-this-argument */
import { toSearchable } from './to-searchable';
import { loadConfig } from '../../shards/utils/load-config';

import { ConfigService } from '@nestjs/config';

import { EntityManager } from '@mikro-orm/core';

import { Injectable, Logger } from '@nestjs/common';

import {
  ANON_ACCOUNT_SLUG,
  MEILISEARCH_BATCH_SIZE,
  MEILISEARCH_DISALLOWED_ID_REGEX,
  MEILISEARCH_ID_SEPARATOR,
  MEILISEARCH_TYPE_FIELD,
} from '@okampus/shared/consts';
import { Event, Individual, Team, Tenant } from '@okampus/api/dal';
import { SearchableEntities } from '@okampus/shared/enums';

import { MeiliSearch } from 'meilisearch';

import type { ApiConfig } from '@okampus/shared/types';
import type { SearchableIndexed, Searchable } from '@okampus/api/dal';
import type { HealthIndicatorResult } from '@nestjs/terminus';

async function toIndexed(entities: Searchable[], type: string): Promise<SearchableIndexed[]> {
  return await Promise.all(
    entities.map(async (entity) => {
      const indexedEntity = await toSearchable(entity);
      const id = MeiliSearchService.getEntityId(entity, type);
      return { ...indexedEntity, id, entityId: entity.id.toString(), entityType: type };
    })
  );
}

const indexedNames = Object.values(SearchableEntities);

@Injectable()
export class MeiliSearchService {
  client: MeiliSearch;
  logger = new Logger(MeiliSearchService.name);
  filterables = ['category', 'tags', 'score', 'entityType'];

  constructor(private readonly configService: ConfigService, private readonly em: EntityManager) {
    const options = loadConfig<ApiConfig['meilisearch']>(this.configService, 'meilisearch');
    this.client = new MeiliSearch(options);
  }

  async checkHealth(name: string): Promise<HealthIndicatorResult> {
    const isAlive = await this.client.isHealthy();
    return { [name]: { status: isAlive ? 'up' : 'down' } };
  }

  canBeIndexed(entity: Searchable): boolean {
    if (entity instanceof Individual && entity.actor.slug === ANON_ACCOUNT_SLUG) return false;
    return true;
  }

  public static indexedEntities = [Event, Team, Individual] as const;

  public static getEntityId(entity: Searchable, type: string): string {
    return [entity.tenant.id, type, entity.id.toString()]
      .join(MEILISEARCH_ID_SEPARATOR)
      .replaceAll(MEILISEARCH_DISALLOWED_ID_REGEX, (x) => x.codePointAt(0)?.toString() ?? '');
  }

  public async init(): Promise<void> {
    const tenants = await this.em.find(Tenant, {});

    for (const tenant of tenants) {
      try {
        const index = this.client.index(tenant.id);
        const response = await index.search('', { facets: [MEILISEARCH_TYPE_FIELD] });

        const facets = response.facetDistribution?.[MEILISEARCH_TYPE_FIELD] ?? {};
        this.logger.log(`Tenant "${tenant.id}" facet distribution: ${JSON.stringify(facets)}`);

        const counts = await Promise.all(indexedNames.map(async (name) => this.countEntities(name, tenant.id)));
        for (const [type, count] of counts) {
          if (count !== 0 && facets[type] !== count)
            throw new Error(`Facet distribution for ${type} is ${facets[type]} but should be ${count}`);
        }
      } catch (error) {
        // If any tenant failed to reindex, we assume the service is not healthy
        this.logger.error(error);
        if (!(await this.reindex(tenant.id))) return;
      }
    }
    this.logger.log('MeiliSearch correctly initialized 🚀');
  }

  public async reindex(tenantId: string): Promise<boolean> {
    this.logger.log(`Reindexing for tenant ${tenantId}...`);

    if (!(await this.client.isHealthy())) {
      this.logger.error('MeiliSearch is not healthy!');
      return false;
    }

    await this.client.deleteIndexIfExists(tenantId);
    await this.client.createIndex(tenantId);

    const index = this.client.index(tenantId);
    await index.updateSettings({ filterableAttributes: this.filterables });

    const counts = await Promise.all(indexedNames.map((type) => this.countEntities(type, tenantId)));

    for (const [type, count] of counts) {
      this.logger.log(`Reindexing ${type} (${count} entities)`);

      for (let offset = 0; offset < count; offset += MEILISEARCH_BATCH_SIZE) {
        const entities = await toIndexed(await this.getEntities(type as SearchableEntities, tenantId), type);
        const upper = Math.min(offset + MEILISEARCH_BATCH_SIZE, count);
        this.logger.log(`Reindexing ${offset} to ${upper}, found ${entities.length} entities`);
        const response = await index.addDocuments(entities);
        this.logger.log(`MeiliSearch answers: ${JSON.stringify(response)}`);
      }
    }
    return true;
  }

  public async create(entity: Searchable): Promise<void> {
    if (this.canBeIndexed(entity)) {
      await this.client.index(entity.tenant.id).addDocuments(await toIndexed([entity], entity.constructor.name));
    }
  }

  public async update(entity: Searchable): Promise<void> {
    if (this.canBeIndexed(entity)) {
      await this.client.index(entity.tenant.id).updateDocuments(await toIndexed([entity], entity.constructor.name));
    }
  }

  public async delete(entity: Searchable): Promise<void> {
    await this.client
      .index(entity.tenant.id)
      .deleteDocument(MeiliSearchService.getEntityId(entity, entity.constructor.name));
  }

  private async countEntities(type: string, tenantId: string): Promise<[name: string, count: number]> {
    const query = { tenant: { id: tenantId } };
    if (type === Individual.name) {
      const filter = { tenant: { id: tenantId }, actor: { slug: { $ne: ANON_ACCOUNT_SLUG } } };
      return [type, await this.em.count(Individual, filter)];
    }

    return [type, await this.em.count<Searchable>(type, query)];
  }

  private async getEntities(entityName: SearchableEntities, tenantId: string): Promise<Searchable[]> {
    if (entityName === SearchableEntities.User) return await this.em.find(Individual, { tenant: { id: tenantId } });
    if (entityName === SearchableEntities.Team) return await this.em.find(Team, { tenant: { id: tenantId } });
    if (entityName === SearchableEntities.Event) return await this.em.find(Event, { tenant: { id: tenantId } });
    return [];
  }
}
