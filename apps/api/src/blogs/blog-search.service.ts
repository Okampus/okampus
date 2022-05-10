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
import { Blog } from './blog.entity';

export interface IndexedBlog {
  title: string;
  body: string;
  category: string;
  author: string;
  tags: string[];
  id: string;
}

@Injectable()
export class BlogSearchService extends SearchService<Blog, IndexedBlog> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'blogs',
    fields: [
      { name: 'title', type: 'string' },
      { name: 'body', type: 'string' },
      { name: 'category', type: 'string' },
      { name: 'author', type: 'string' },
      { name: 'tags', type: 'string[]' },
    ],
  };

  private readonly documents = client.collections<IndexedBlog>('blogs').documents();

  constructor(
    @InjectRepository(Blog) private readonly blogRepository: BaseRepository<Blog>,
  ) { super(BlogSearchService.schema, 'blogs'); }

  @RequireTypesense()
  public async init(): Promise<void> {
    const blogs = await this.blogRepository.findAll({ populate: ['post', 'post.author'] });
    await super.init(blogs, entity => this.toIndexedEntity(entity));
  }

  @RequireTypesense()
  public async add(blog: Blog): Promise<void> {
    await this.documents.create(this.toIndexedEntity(blog));
  }

  @RequireTypesense()
  public async update(blog: Blog): Promise<void> {
    await this.documents.update(this.toIndexedEntity(blog)).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async remove(blogId: string): Promise<void> {
    await this.documents.delete(blogId).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams): Promise<SearchResponse<IndexedBlog>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams): Promise<SearchResponse<Blog>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const blogIds = results.hits.map(hit => hit.document.id).map(Number);
      const blogs = await this.blogRepository.find({ contentMasterId: { $in: blogIds } });
      for (const hit of results.hits)
        // @ts-expect-error: This works, TypeScript... I know there is a mismatch between IndexedBlog.id and
        // Blog.blogId. I know.
        hit.document = blogs.find(blog => blog.blogId === hit.document.id)!;
    }
    // @ts-expect-error: Ditto.
    return results;
  }

  public toIndexedEntity(blog: Blog): IndexedBlog {
    return {
      title: blog.title,
      body: removeMarkdown(blog.post!.body),
      category: blog.category,
      author: blog.post!.author.getFullName(),
      tags: blog.tags.toArray().map(tag => tag.name),
      id: blog.contentMasterId.toString(),
    };
  }
}
