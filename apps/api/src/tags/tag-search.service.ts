import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { client } from '../shared/configs/typesense.config';
import RequireTypesense from '../shared/lib/decorators/require-typesense.decorator';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { authorizeNotFound, SearchService } from '../shared/modules/search/search.service';
import { Tag } from './tag.entity';

export interface IndexedTag {
  name: string;
  description: string | null;
  id: string;
}

@Injectable()
export class TagSearchService extends SearchService<Tag, IndexedTag> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'tags',
    fields: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string', optional: true },
    ],
  };

  private readonly documents = client.collections<IndexedTag>('tags').documents();

  constructor(
    @InjectRepository(Tag) private readonly tagRepository: BaseRepository<Tag>,
  ) { super(TagSearchService.schema, 'tags'); }

  @RequireTypesense()
  public async init(): Promise<void> {
    const tags = await this.tagRepository.findAll();
    await super.init(tags, entity => this.toIndexedEntity(entity));
  }

  @RequireTypesense()
  public async add(tag: Tag): Promise<void> {
    await this.documents.create(this.toIndexedEntity(tag));
  }

  @RequireTypesense()
  public async update(tag: Tag): Promise<void> {
    await this.documents.update(this.toIndexedEntity(tag)).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async remove(id: string): Promise<void> {
    await this.documents.delete(id).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams): Promise<SearchResponse<IndexedTag>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams): Promise<SearchResponse<Tag>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const ids = results.hits.map(hit => Number(hit.document.id));
      const tags = await this.tagRepository.find({ id: { $in: ids } });
      for (const hit of results.hits)
        // @ts-expect-error: hit.document is an IndexedTag but we are overwriting it with a Tag
        hit.document = tags.find(tag => tag.id.toString() === hit.document.id)!;
    }
    // @ts-expect-error: this is now a SearchResponse<Tag>
    return results;
  }

  public toIndexedEntity(tag: Tag): IndexedTag {
    return {
      name: tag.name,
      description: tag.description,
      id: tag.id.toString(),
    };
  }
}
