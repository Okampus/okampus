import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import removeMarkdown from 'markdown-to-text';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { client } from '../shared/configs/typesense.config';
import RequireTypesense from '../shared/lib/decorators/require-typesense.decorator';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { authorizeNotFound, SearchService } from '../shared/modules/search/search.service';
import { Thread } from './thread.entity';

export interface IndexedThread {
  title: string;
  body: string;
  author: string;
  tags: string[];
  id: string;
}

@Injectable()
export class ThreadSearchService extends SearchService<Thread, IndexedThread> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'threads',
    fields: [
      { name: 'title', type: 'string' },
      { name: 'body', type: 'string' },
      { name: 'author', type: 'string' },
      { name: 'tags', type: 'string[]' },
    ],
  };

  private readonly documents = client.collections<IndexedThread>('threads').documents();

  constructor(
    @InjectRepository(Thread) private readonly threadRepository: BaseRepository<Thread>,
  ) { super(ThreadSearchService.schema, 'threads'); }

  @RequireTypesense()
  public async init(): Promise<void> {
    const threads = await this.threadRepository.findAll({ populate: ['post', 'post.author'] });
    await super.init(threads, entity => this.toIndexedEntity(entity));
  }

  @RequireTypesense()
  public async add(thread: Thread): Promise<void> {
    await this.documents.create(this.toIndexedEntity(thread));
  }

  @RequireTypesense()
  public async update(thread: Thread): Promise<void> {
    await this.documents.update(this.toIndexedEntity(thread)).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async remove(id: string): Promise<void> {
    await this.documents.delete(id).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams): Promise<SearchResponse<IndexedThread>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams): Promise<SearchResponse<Thread>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const threadIds = results.hits.map(hit => Number(hit.document.id));
      const threads = await this.threadRepository.find({ id: { $in: threadIds } });
      for (const hit of results.hits)
        // @ts-expect-error: hit.document is an IndexedThread but we are overwriting it with a Thread
        hit.document = threads.find(thread => thread.id.toString() === hit.document.id)!;
    }
    // @ts-expect-error: this is now a SearchResponse<Thread>
    return results;
  }

  public toIndexedEntity(thread: Thread): IndexedThread {
    return {
      title: thread.title,
      body: removeMarkdown(thread.post.body),
      author: thread.post.author.getFullName(),
      tags: thread.tags.toArray().map(tag => tag.name),
      id: thread.id.toString(),
    };
  }
}
