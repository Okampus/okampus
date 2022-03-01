import { Logger } from '@nestjs/common';
import type { CollectionFieldSchema } from 'typesense/lib/Typesense/Collection';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import type { ImportResponse, SearchParams, SearchResponse } from 'typesense/lib/Typesense/Documents';
import type { TypesenseError } from 'typesense/lib/Typesense/Errors';
import { client } from '../../configs/typesense.config';

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
      if (process.env.FORCE_REINDEX === 'true'
        || collection.num_documents !== entities.length
        || this.hasChanges(collection.fields, this.schema.fields)) {
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
      let returnData: ImportResponse[] = [];
      try {
        returnData = await client
          .collections<IndexedEntity>(this.collectionName)
          .documents()
          .import(entities.map(toIndexedEntity));
      } catch (error) {
        throw new Error(`Error importing documents ${JSON.stringify(error, null, 2)}.\nError: ${error}`);
      }

      const failedItems = returnData.filter(item => !item.success);
      if (failedItems.length > 0)
        throw new Error(`Error indexing documents ${JSON.stringify(failedItems, null, 2)}`);
    }

    logger.log('Indexing finished.');
  }

  private hasChanges(existingFields: CollectionFieldSchema[], newFields: CollectionFieldSchema[]): boolean {
    if (existingFields.length !== newFields.length)
      return true;

    for (const [i, existingField] of existingFields.entries()) {
      const newField = newFields[i];
      if (existingField.name !== newField.name
        || existingField.type !== newField.type
        || existingField.optional !== newField.optional
        || existingField.facet !== newField.facet
        || existingField.index !== newField.index)
        return true;
    }

    return false;
  }

  public abstract add(entity: Entity): Promise<void>;

  public abstract update(entity: Entity): Promise<void>;

  public abstract remove(id: string): Promise<void>;

  public abstract search(queries: SearchParams): Promise<SearchResponse<IndexedEntity>>;

  public abstract searchAndPopulate(queries: SearchParams): Promise<SearchResponse<Entity>>;

  public abstract toIndexedEntity(entity: Entity): IndexedEntity;
}
