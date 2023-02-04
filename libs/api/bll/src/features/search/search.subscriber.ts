import { MeiliSearchIndexerService } from './meilisearch-indexer.service';
import { Injectable } from '@nestjs/common';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import type { EntityManager } from '@mikro-orm/core';
import type { EntityName, EventArgs, EventSubscriber } from '@mikro-orm/core';
import type MeiliSearch from 'meilisearch';
// import { config } from '@api/configs/config';
// import type { RequiredProp } from '@api/shards/types/types/required-prop.type';
import type { IndexableEntities } from './meilisearch-indexer.service';
import type { RequiredProp } from '@okampus/shared/types';

const _isValid = (
  args: EventArgs<IndexableEntities>
): args is RequiredProp<EventArgs<IndexableEntities>, 'changeSet'> => {
  if (!args.changeSet) return false;
  // if (args.changeSet.name === 'user' && args.entity.id === config.anonAccount.username) return false;

  return true;
};

@Injectable()
export class SearchSubscriber implements EventSubscriber {
  constructor(private readonly em: EntityManager, @InjectMeiliSearch() private readonly meiliSearch: MeiliSearch) {
    this.em.getEventManager().registerSubscriber(this);
  }

  public getSubscribedEntities(): Array<EntityName<IndexableEntities>> {
    return [...MeiliSearchIndexerService.indexedEntities];
  }

  // TODO: do that with sagas

  // public async afterCreate(args: EventArgs<IndexableEntities>): Promise<void> {
  //   if (config.meilisearch.enabled && isValid(args)) {
  //     await this.meiliSearch
  //       .index(args.entity.tenant.slug)
  //       .addDocuments(
  //         await MeiliSearchIndexerService.entitiesToIndexedEntities(
  //           [args.entity],
  //           args.changeSet.name
  //         )
  //       );
  //   }
  // }

  // public async afterUpdate(args: EventArgs<IndexableEntities>): Promise<void> {
  //   if (config.meilisearch.enabled && isValid(args)) {
  //     await this.meiliSearch
  //       .index(args.entity.tenant.slug)
  //       .updateDocuments(
  //         await MeiliSearchIndexerService.entitiesToIndexedEntities(
  //           [args.entity],
  //           args.changeSet.name
  //         )
  //       );
  //   }
  // }

  // public async afterDelete(args: EventArgs<IndexableEntities>): Promise<void> {
  //   if (config.meilisearch.enabled && args.changeSet) {
  //     await this.meiliSearch
  //       .index(args.entity.tenant.slug)
  //       .deleteDocument(MeiliSearchIndexerService.getEntityId(args.entity, args.changeSet.name));
  //   }
  // }
}
