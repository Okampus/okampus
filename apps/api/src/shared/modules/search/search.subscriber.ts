import { EntityManager } from '@mikro-orm/core';
import type { EntityName, EventArgs, EventSubscriber } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import MeiliSearch from 'meilisearch';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { config } from '../../configs/config';
import type { RequiredProp } from '../../lib/types/types/required-prop.type';
import type { IndexableEntities } from './meilisearch-indexer.service';
import { MeiliSearchIndexerService } from './meilisearch-indexer.service';

const isValid = (args: EventArgs<IndexableEntities>): args is RequiredProp<EventArgs<IndexableEntities>, 'changeSet'> => {
  if (!args.changeSet)
    return false;
  if (args.changeSet.name === 'user' && args.entity.id === config.anonAccount.username)
    return false;

  return true;
};

@Injectable()
export class SearchSubscriber implements EventSubscriber<IndexableEntities> {
  constructor(
    private readonly em: EntityManager,
    @InjectMeiliSearch() private readonly meiliSearch: MeiliSearch,
  ) {
    this.em.getEventManager().registerSubscriber(this);
  }

  public getSubscribedEntities(): Array<EntityName<IndexableEntities>> {
    return [...MeiliSearchIndexerService.indexedEntities];
  }

  public async afterCreate(args: EventArgs<IndexableEntities>): Promise<void> {
    if (config.meilisearch.enabled && isValid(args)) {
      await this.meiliSearch.index(args.entity.tenant.id).addDocuments(
        await MeiliSearchIndexerService.entitiesToIndexedEntities([args.entity], args.changeSet.name),
      );
    }
  }

  public async afterUpdate(args: EventArgs<IndexableEntities>): Promise<void> {
    if (config.meilisearch.enabled && isValid(args)) {
      await this.meiliSearch.index(args.entity.tenant.id).updateDocuments(
        await MeiliSearchIndexerService.entitiesToIndexedEntities([args.entity], args.changeSet.name),
      );
    }
  }

  public async afterDelete(args: EventArgs<IndexableEntities>): Promise<void> {
    if (config.meilisearch.enabled && args.changeSet) {
      await this.meiliSearch.index(args.entity.tenant.id).deleteDocument(
        MeiliSearchIndexerService.getEntityId(args.entity, args.changeSet.name),
      );
    }
  }
}
