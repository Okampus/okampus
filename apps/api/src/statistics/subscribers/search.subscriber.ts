import { EntityManager } from '@mikro-orm/core';
import type { EntityName, EventArgs, EventSubscriber } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { config } from '../../shared/configs/config';
import { MEILISEARCH_ID_SEPARATOR } from '../../shared/lib/constants';
import type { AllIndexableEntities } from '../../shared/modules/search/meilisearch.global';
import { MeiliSearchGlobal, searchEntities } from '../../shared/modules/search/meilisearch.global';

const ignore = (args: EventArgs<AllIndexableEntities>): boolean => {
  if (!args.changeSet)
    return true;
  if (args.changeSet.name === 'user' && args.entity.id === config.anonAccount.username)
    return true;

  return false;
};

@Injectable()
export class SearchSubscriber implements EventSubscriber<AllIndexableEntities> {
  constructor(
    private readonly em: EntityManager,
    private readonly meiliSearchGlobal: MeiliSearchGlobal,
  ) {
    em.getEventManager().registerSubscriber(this);
  }

  public getSubscribedEntities(): Array<EntityName<AllIndexableEntities>> {
    return [...searchEntities];
  }

  public async afterCreate(args: EventArgs<AllIndexableEntities>): Promise<void> {
    if (!ignore(args) && config.meilisearch.enabled) {
      await this.meiliSearchGlobal.client.index(args.entity.tenant.id).addDocuments(
        MeiliSearchGlobal.entityToIndexedEntity([args.entity], args?.changeSet?.name ?? 'unknown'),
      );
    }
  }

  public async afterUpdate(args: EventArgs<AllIndexableEntities>): Promise<void> {
    if (!ignore(args) && config.meilisearch.enabled) {
      await this.meiliSearchGlobal.client.index(args.entity.tenant.id).updateDocuments(
        MeiliSearchGlobal.entityToIndexedEntity([args.entity], args?.changeSet?.name ?? 'unknown'),
      );
    }
  }

  public async afterDelete(args: EventArgs<AllIndexableEntities>): Promise<void> {
    if (args.changeSet && config.meilisearch.enabled) {
      await this.meiliSearchGlobal.client.index(args.entity.tenant.id).deleteDocument(
        `${args.entity.tenant.id}${MEILISEARCH_ID_SEPARATOR}${args.changeSet.name}${MEILISEARCH_ID_SEPARATOR}${args.entity.id}`,
      );
    }
  }
}
