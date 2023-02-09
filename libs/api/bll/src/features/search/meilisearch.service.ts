// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../global/config.module';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantCoreRepository, TeamRepository, UserRepository, TenantEventRepository } from '@okampus/api/dal';

import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Team, TenantEvent, User } from '@okampus/api/dal';
import {
  ANON_ACCOUNT_SLUG,
  MEILISEARCH_BATCH_SIZE,
  MEILISEARCH_DISALLOWED_ID_REGEX,
  MEILISEARCH_ID_SEPARATOR,
  MEILISEARCH_TYPE_FIELD,
} from '@okampus/shared/consts';
import { SearchableEntities } from '@okampus/shared/enums';

import { MeiliSearch } from 'meilisearch';

import type { SearchEntity, SearchableEntity } from '@okampus/api/dal';
import type { Snowflake } from '@okampus/shared/types';
import type { HealthIndicatorResult } from '@nestjs/terminus';

async function toIndexedEntities(entities: SearchableEntity[], type: string): Promise<SearchEntity[]> {
  return await Promise.all(
    entities.map(async (entity) => {
      const indexedEntity = await entity.toIndexed();
      return {
        ...indexedEntity,
        id: MeiliSearchService.getEntityId(entity, type),
        entityId: entity.id.toString(),
        entityType: type,
      };
    })
  );
}

const indexedNames = Object.values(SearchableEntities);

@Injectable()
export class MeiliSearchService {
  client: MeiliSearch;
  static isHealthy = false;

  constructor(
    private readonly tenantCoreRepository: TenantCoreRepository,
    private readonly teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
    private readonly tenantEventRepository: TenantEventRepository,
    private readonly configService: ConfigService,
    private readonly em: EntityManager
  ) {
    this.client = new MeiliSearch({
      host: this.configService.config.meilisearch.host,
      apiKey: this.configService.config.meilisearch.apiKey,
    });
  }

  async checkHealth(name: string): Promise<HealthIndicatorResult> {
    const isAlive = await this.client.isHealthy();
    return { [name]: { status: isAlive ? 'up' : 'down' } };
  }

  canBeIndexed(entity: SearchableEntity): boolean {
    if (entity instanceof User && entity.actor.slug === ANON_ACCOUNT_SLUG) return false;
    return true;
  }

  public static indexedEntities = [TenantEvent, Team, User] as const;

  private readonly logger = new ConsoleLogger('MeiliSearch');
  private readonly filterables = ['category', 'tags', 'score', 'entityType'];

  public static getEntityId(entity: SearchableEntity, type: string): string {
    return [entity.tenant.id, type, entity.id.toString()]
      .join(MEILISEARCH_ID_SEPARATOR)
      .replaceAll(MEILISEARCH_DISALLOWED_ID_REGEX, (x) => x.codePointAt(0)?.toString() ?? '');
  }

  public async init(): Promise<void> {
    const tenants = await this.tenantCoreRepository.findAll();

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
    MeiliSearchService.isHealthy = true;
  }

  public async reindex(tenantId: Snowflake): Promise<boolean> {
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
        const entities = await toIndexedEntities(await this.getEntities(type as SearchableEntities, tenantId), type);
        const upper = Math.min(offset + MEILISEARCH_BATCH_SIZE, count);
        this.logger.log(`Reindexing ${offset} to ${upper}, found ${entities.length} entities`);
        const response = await index.addDocuments(entities);
        this.logger.log(`MeiliSearch answers: ${JSON.stringify(response)}`);
      }
    }
    return true;
  }

  public async create(entity: SearchableEntity): Promise<void> {
    if (this.canBeIndexed(entity)) {
      await this.client
        .index(entity.tenant.id)
        .addDocuments(await toIndexedEntities([entity], entity.constructor.name));
    }
  }

  public async update(entity: SearchableEntity): Promise<void> {
    if (this.canBeIndexed(entity)) {
      await this.client
        .index(entity.tenant.id)
        .updateDocuments(await toIndexedEntities([entity], entity.constructor.name));
    }
  }

  public async delete(entity: SearchableEntity): Promise<void> {
    await this.client
      .index(entity.tenant.id)
      .deleteDocument(MeiliSearchService.getEntityId(entity, entity.constructor.name));
  }

  private async countEntities(type: string, tenantId: Snowflake): Promise<[name: string, count: number]> {
    const query = { tenant: { id: tenantId } };
    if (type === User.name) {
      const filter = { tenant: { id: tenantId }, actor: { slug: { $ne: ANON_ACCOUNT_SLUG } } };
      return [type, await this.userRepository.count(filter)];
    }

    return [type, await this.em.count<SearchableEntity>(type, query)];
  }

  private async getEntities(entityName: SearchableEntities, tenantId: Snowflake): Promise<SearchableEntity[]> {
    if (entityName === SearchableEntities.User) return await this.userRepository.findSearchable(tenantId);
    if (entityName === SearchableEntities.Team) return await this.teamRepository.findSearchable(tenantId);
    if (entityName === SearchableEntities.TenantEvent) return await this.tenantEventRepository.findSearchable(tenantId);
    return [];
  }
}
