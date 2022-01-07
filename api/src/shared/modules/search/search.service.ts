import { Logger } from '@nestjs/common';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import type { SearchParams, SearchResponse } from 'typesense/lib/Typesense/Documents';
import type { TypesenseError } from 'typesense/lib/Typesense/Errors';
import { client } from '../../../typesense.config';

export const authorizeNotFound = (error: TypesenseError): void => {
  if (error.httpStatus !== 404)
    throw error;
};

export abstract class SearchService<Entity, IndexedEntity> {
  constructor(
    private readonly schema: CollectionCreateSchema,
    private readonly collectionName: string,
  ) {}

  public async init(entities: Entity[], toIndexedEntity: (entity: Entity) => IndexedEntity): Promise<void> {
    const logger = new Logger(`IndexInitializer:${this.collectionName}`);

    let reindexNeeded = false;
    try {
      const collection = await client.collections(this.collectionName).retrieve();
      logger.log('Found existing schema');
      if (collection.num_documents !== entities.length || process.env.FORCE_REINDEX === 'true') {
        reindexNeeded = true;
        await client.collections(this.collectionName).delete();
      }
    } catch {
      reindexNeeded = true;
    }

    if (!reindexNeeded) {
      logger.log('Index was up to date');
      return;
    }

    logger.log('Reindexing...');
    await client.collections().create(this.schema);

    if (entities.length > 0) {
      const returnData = await client
        .collections<IndexedEntity>(this.collectionName)
        .documents()
        .import(entities.map(entity => toIndexedEntity(entity)));

      const failedItems = returnData.filter(item => !item.success);
      if (failedItems.length > 0)
        throw new Error(`Error indexing items ${JSON.stringify(failedItems, null, 2)}`);
    }

    logger.log('Indexing finished.');
  }

  public abstract add(entity: Entity): Promise<void>;

  public abstract update(entity: Entity): Promise<void>;

  public abstract remove(id: string): Promise<void>;

  public abstract search(queries: SearchParams<IndexedEntity>): Promise<SearchResponse<IndexedEntity>>;

  public abstract searchAndPopulate(queries: SearchParams<IndexedEntity>): Promise<SearchResponse<Entity>>;

  public abstract toIndexedEntity(entity: Entity): IndexedEntity;
}
