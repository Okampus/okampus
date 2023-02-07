// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../global/config.module';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports

import { Injectable, Logger } from '@nestjs/common';
import { Team, Tenant, User } from '@okampus/api/dal';
import { MEILISEARCH_BATCH_SIZE, MEILISEARCH_ID_SEPARATOR } from '@okampus/shared/consts';
import { getErrorMessage } from '@okampus/shared/utils';
import type { MeiliSearchService } from '../../global/meilisearch.module';
import type { EntityManager } from '@mikro-orm/core';
import type { FilterQuery, FindOptions } from '@mikro-orm/core';
import type { IndexedEntity } from './indexed-entity.interface';

export type IndexableEntities = Team | User;

@Injectable()
export class MeiliSearchIndexerService {
  public static indexedEntities = [Team.name, User.name] as const;

  private readonly logger = new Logger('MeiliSearch');
  private readonly filterables = ['category', 'tags', 'score', 'metaType'];

  constructor(
    private readonly configModule: ConfigService,
    private readonly meiliSearchService: MeiliSearchService,
    private readonly em: EntityManager
  ) {}

  public static async entitiesToIndexedEntities(
    _entities: IndexableEntities[],
    _type: string
  ): Promise<IndexedEntity[]> {
    return [];
    // return await Promise.all(
    //   entities.map(async (entity) => ({
    //     id: MeiliSearchIndexerService.getEntityId(entity, type),
    //     realId: entity.id.toString(),
    //     metaType: type.toLowerCase(),
    //     ...(await entity.toIndexed()),
    //   }))
    // );
  }

  public static getEntityId(entity: IndexableEntities, type: string): string {
    return [entity.tenant.domain, type.toLowerCase(), entity.id.toString()]
      .join(MEILISEARCH_ID_SEPARATOR)
      .replaceAll(/[^\w-]/g, (x) => x.codePointAt(0)?.toString() ?? '');
  }

  public async init(): Promise<void> {
    const tenants = await this.em.getRepository(Tenant).findAll();

    for (const tenant of tenants) {
      try {
        const index = this.meiliSearchService.client.index(tenant.actor.slug);
        const response = await index.search('', { facets: ['metaType'] });

        const facetDistribution: Record<string, number> = {};
        if (response.facetDistribution?.metaType) {
          for (const [name, count] of Object.entries(response.facetDistribution.metaType))
            facetDistribution[name] = count;
        }
        this.logger.log(`Tenant "${tenant.actor.slug}" facet distribution: ${JSON.stringify(facetDistribution)}`);

        const counts = await Promise.all(
          MeiliSearchIndexerService.indexedEntities.map(async (entityName) => this.countEntities(entityName, tenant))
        );

        for (const [name, count] of counts) {
          if (count !== 0 && facetDistribution[name.toLowerCase()] !== count)
            throw new Error(`Facet distribution for ${name} is ${facetDistribution[name]} but should be ${count}`);
        }
      } catch (error) {
        this.logger.error(getErrorMessage(error));
        // If any tenant failed to reindex, we assume the service is not healthy
        // TODO: forbid access to the service if this is the case
        if (!(await this.reindex(tenant))) return;
      }
    }
    this.logger.log('MeiliSearch initialized');
  }

  public async reindex(tenant: Tenant): Promise<boolean> {
    this.logger.log(`Reindexing for tenant ${tenant.actor.slug}...`);

    if (!(await this.meiliSearchService.client.isHealthy())) {
      this.logger.warn('MeiliSearch is not healthy');
      return false;
    }

    await this.meiliSearchService.client.deleteIndexIfExists(tenant.actor.slug);
    await this.meiliSearchService.client.createIndex(tenant.actor.slug);

    const index = this.meiliSearchService.client.index(tenant.actor.slug);
    await index.updateSettings({ filterableAttributes: this.filterables });

    const counts = await Promise.all(
      MeiliSearchIndexerService.indexedEntities.map(async (entityName) => this.countEntities(entityName, tenant))
    );

    for (const [name, count] of counts) {
      this.logger.log(`Reindexing ${name} (${count} entities)`);

      for (let offset = 0; offset < count; offset += MEILISEARCH_BATCH_SIZE) {
        const entities = await this.getEntities(name, tenant, {
          offset,
          limit: MEILISEARCH_BATCH_SIZE,
        });
        const indexedEntities = await MeiliSearchIndexerService.entitiesToIndexedEntities(entities, name);
        this.logger.log(
          `Reindexing ${offset} to ${Math.min(offset + MEILISEARCH_BATCH_SIZE, count)}, found ${
            indexedEntities.length
          } entities`
        );
        const response = await index.addDocuments(indexedEntities);
        this.logger.log(`Response: ${JSON.stringify(response)}`);
      }
    }
    return true;
  }

  private async countEntities(entityName: string, tenant: Tenant): Promise<[name: string, count: number]> {
    const query: FilterQuery<IndexableEntities> = { tenant };
    if (entityName === User.name) query.id = { $ne: this.configModule.config.anonAccount.slug };

    return [entityName, await this.em.count<IndexableEntities>(entityName, query)];
  }

  private async getEntities(
    entityName: string,
    tenant: Tenant,
    options: FindOptions<IndexableEntities>
  ): Promise<IndexableEntities[]> {
    const query: FilterQuery<IndexableEntities> = { tenant };
    if (entityName === User.name) query.id = { $ne: this.configModule.config.anonAccount.slug };

    return await this.em.find<IndexableEntities>(entityName, query, options);
  }
}
