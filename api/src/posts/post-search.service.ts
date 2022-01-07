import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import TypesenseEnabled from '../shared/lib/decorators/typesense-enabled.decorator';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { extractTextFromTiptap } from '../shared/lib/utils/extractTextFromTiptap';
import type { SimplifiedTiptapJSONContent } from '../shared/lib/utils/extractTextFromTiptap';
import { authorizeNotFound, SearchService } from '../shared/modules/search/search.service';
import { client } from '../typesense.config';
import { Post } from './entities/post.entity';

export interface IndexedPost {
  title: string;
  body: string;
  author: string;
  tags: string[];
  id: string;
  createdAt: string;
}

@Injectable()
export class PostSearchService extends SearchService<Post, IndexedPost> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'posts',
    fields: [
      { name: 'title', type: 'string' },
      { name: 'body', type: 'string' },
      { name: 'author', type: 'string' },
      { name: 'tags', type: 'string[]' },
      { name: 'createdAt', type: 'string' },
    ],
  };

  private readonly documents = client.collections<IndexedPost>('posts').documents();

  constructor(
    @InjectRepository(Post) private readonly postRepository: BaseRepository<Post>,
  ) { super(PostSearchService.schema, 'posts'); }

  @TypesenseEnabled()
  public async init(): Promise<void> {
    const posts = await this.postRepository.find({}, ['author', 'tags']);
    await super.init(posts, entity => this.toIndexedEntity(entity));
  }

  @TypesenseEnabled()
  public async add(post: Post): Promise<void> {
    await this.documents.create(this.toIndexedEntity(post));
  }

  @TypesenseEnabled()
  public async update(post: Post): Promise<void> {
    await this.documents.update(this.toIndexedEntity(post)).catch(authorizeNotFound);
  }

  @TypesenseEnabled()
  public async remove(postId: string): Promise<void> {
    await this.documents.delete(postId).catch(authorizeNotFound);
  }

  @TypesenseEnabled()
  public async search(queries: SearchParams<IndexedPost>): Promise<SearchResponse<IndexedPost>> {
    return await this.documents.search(queries);
  }

  @TypesenseEnabled()
  public async searchAndPopulate(queries: SearchParams<IndexedPost>): Promise<SearchResponse<Post>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const postIds = results.hits.map(hit => hit.document.id).map(Number);
      const posts = await this.postRepository.find({ postId: { $in: postIds } });
      for (const hit of results.hits)
        // @ts-expect-error: This works, TypeScript... I know there is a mismatch between IndexedPost.id and
        // Post.postId. I know.
        hit.document = posts.find(post => post.postId.toString() === hit.document.id)!;
    }
    // @ts-expect-error: Ditto.
    return results;
  }

  public toIndexedEntity(post: Post): IndexedPost {
    return {
      title: post.title,
      body: extractTextFromTiptap(JSON.parse(post.body) as SimplifiedTiptapJSONContent),
      author: post.author.username,
      tags: post.tags.toArray().map(tag => tag.name),
      id: post.postId.toString(),
      createdAt: post.createdAt.toString(),
    };
  }
}
