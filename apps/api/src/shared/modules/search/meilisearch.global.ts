/* eslint-disable no-await-in-loop */
import type { FindOptions } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';
import type { Index } from 'meilisearch';
import { Team } from '../../../teams/teams/team.entity';
import { Tenant } from '../../../tenants/tenants/tenant.entity';
import { User } from '../../../users/user.entity';
import { config } from '../../configs/config';
import { meiliSearchClient } from '../../configs/meilisearch.config';
import { MEILISEARCH_BATCH_SIZE, MEILISEARCH_ID_SEPARATOR } from '../../lib/constants';


export interface BaseIndex {
  [key: string]: unknown;
  title: string;
  picture: string | null;
  description: string | null;
  category: string | null;
  createdDate: number;
  updatedDate: number;
  users: string[] | null;
  tags: string[] | null;
}
export type IndexedEntity = BaseIndex & { id: string; realId: string; metaType: string };

export type AllIndexableEntities = Team | User;
export type AllIndexableEntityNames = typeof Team | typeof User;
export const searchEntities = [Team, User];

const filterables = ['category', 'tags', 'score', 'metaType'];

const countEntities = async (
  entity: AllIndexableEntityNames,
  tenant: { id: string },
  em: EntityManager,
): Promise<[name: string, count: number]> => {
  if (entity.name.toLowerCase() === 'user') {
    return [
      entity.name.toLowerCase(),
      await em.count<User>(entity as typeof User, { tenant, id: { $ne: config.anonAccount.username } }),
    ];
  }
  return [entity.name.toLowerCase(), await em.count<AllIndexableEntities>(entity, { tenant })];
};

const getEntities = async (
  entity: AllIndexableEntityNames,
  tenant: { id: string },
  em: EntityManager,
  options: FindOptions<AllIndexableEntities>,
): Promise<AllIndexableEntities[]> => {
  if (entity.name.toLowerCase() === 'user') {
    return await em.find<User>(entity as typeof User, {
      tenant,
      id: { $ne: config.anonAccount.username },
    }, options as FindOptions<User>);
  }

  return await em.find<AllIndexableEntities>(entity, { tenant }, options);
};

@Injectable()
export class MeiliSearchGlobal {
  public readonly client = meiliSearchClient;

  public indexes: Record<string, Index> = {};
  public logger = new Logger('MeiliSearch');
  public initialised = false;

  constructor(
    private readonly em: EntityManager,
  ) {}


  public static entityToIndexedEntity(entities: AllIndexableEntities[], type: string): IndexedEntity[] {
    return entities.map(entity => ({
      id: `${entity.tenant.id}${MEILISEARCH_ID_SEPARATOR}${type.toLowerCase()}${MEILISEARCH_ID_SEPARATOR}${entity.id}`,
      realId: entity.id.toString(),
      metaType: type.toLowerCase(),
      ...entity.toIndexed(),
    }));
  }

  public async init(): Promise<void> {
    const tenants = await this.em.getRepository(Tenant).findAll();

    for (const tenant of tenants) {
      try {
        this.indexes[tenant.id] = this.client.index(tenant.id);
        const response = await this.indexes[tenant.id].search('', {
          facets: ['metaType'],
        });

        const facetDistribution: Record<string, number> = {};
        if (response.facetDistribution?.metaType) {
          for (const [name, count] of Object.entries(response.facetDistribution.metaType))
            facetDistribution[name] = count;
        }
        this.logger.log(`Tenant ${tenant.id} facet distribution: ${JSON.stringify(facetDistribution)}`);

        const counts = await Promise.all(searchEntities.map(async entity => countEntities(entity, tenant, this.em)));

        for (const [name, count] of counts) {
          if (count !== 0 && facetDistribution[name] !== count)
            throw new Error(`Facet distribution for ${name} is ${facetDistribution[name]} but should be ${count}`);
        }
      } catch (error) {
        this.logger.error(error.message);
        // If any tenant failed to reindex, we assume the service is not healthy
        // TODO: forbid access to the service if this is the case
        if (!(await this.reindex(tenant.id)))
          return;
      }
    }
    this.initialised = true;
    this.logger.log('MeiliSearch initialized!');
  }

  public async reindex(tenantId: string): Promise<boolean> {
    if (!(await this.client.isHealthy())) {
      this.logger.error('MeiliSearch service is not healthy!');
      this.initialised = false;
      return false;
    }

    this.logger.log('Reindexing...');
    await this.client.deleteIndexIfExists(tenantId);
    await this.client.createIndex(tenantId);
    this.indexes[tenantId] = this.client.index(tenantId);
    await this.indexes[tenantId].updateSettings({ filterableAttributes: filterables });

    const counts = await Promise.all(
      searchEntities.map(async entity => [entity, ...await countEntities(entity, { id: tenantId }, this.em)]),
    );


    for (const [entity, name, count] of counts) {
      this.logger.log(`Reindexing ${name}`);

      for (let offset = 0; offset < count; offset += MEILISEARCH_BATCH_SIZE) {
        const entities = await getEntities(
          entity as AllIndexableEntityNames,
          { id: tenantId },
          this.em,
          { offset, limit: MEILISEARCH_BATCH_SIZE },
        );

        await this.indexes[tenantId].addDocuments(MeiliSearchGlobal.entityToIndexedEntity(entities, name as string));
        this.logger.log(`Indexing ${offset + MEILISEARCH_BATCH_SIZE > count ? count : offset + MEILISEARCH_BATCH_SIZE} / ${count as number}`);
      }
    }
    this.logger.log('Reindexing finished!');
    return true;
  }
}
