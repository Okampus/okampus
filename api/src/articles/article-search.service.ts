import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import RequireTypesense from '../shared/lib/decorators/require-typesense.decorator';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { extractTextFromStringifiedTiptap } from '../shared/lib/utils/extractTextFromTiptap';
import { authorizeNotFound, SearchService } from '../shared/modules/search/search.service';
import { client } from '../typesense.config';
import { Article } from './entities/article.entity';

export interface IndexedArticle {
  title: string;
  body: string;
  author: string;
  tags: string[];
  category: string;
  locationName?: string;
  id: string;
  createdAt: string;
}

@Injectable()
export class ArticleSearchService extends SearchService<Article, IndexedArticle> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'articles',
    fields: [
      { name: 'title', type: 'string' },
      { name: 'body', type: 'string' },
      { name: 'author', type: 'string' },
      { name: 'tags', type: 'string[]' },
      { name: 'category', type: 'string' },
      { name: 'locationName', type: 'string', optional: true },
      { name: 'createdAt', type: 'string' },
    ],
  };

  private readonly documents = client.collections<IndexedArticle>('articles').documents();

  constructor(
    @InjectRepository(Article) private readonly articleRepository: BaseRepository<Article>,
  ) { super(ArticleSearchService.schema, 'articles'); }

  @RequireTypesense()
  public async init(): Promise<void> {
    const articles = await this.articleRepository.find({}, ['author', 'tags']);
    await super.init(articles, entity => this.toIndexedEntity(entity));
  }

  @RequireTypesense()
  public async add(article: Article): Promise<void> {
    await this.documents.create(this.toIndexedEntity(article));
  }

  @RequireTypesense()
  public async update(article: Article): Promise<void> {
    await this.documents.update(this.toIndexedEntity(article)).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async remove(articleId: string): Promise<void> {
    await this.documents.delete(articleId).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams<IndexedArticle>): Promise<SearchResponse<IndexedArticle>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams<IndexedArticle>): Promise<SearchResponse<Article>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const articleIds = results.hits.map(hit => hit.document.id).map(Number);
      const articles = await this.articleRepository.find({ articleId: { $in: articleIds } });
      for (const hit of results.hits)
        // @ts-expect-error: This works, TypeScript... I know there is a mismatch between IndexedArticle.id and
        // Article.articleId. I know.
        hit.document = articles.find(article => article.articleId.toString() === hit.document.id)!;
    }
    // @ts-expect-error: Ditto.
    return results;
  }

  public toIndexedEntity(article: Article): IndexedArticle {
    return {
      title: article.title,
      body: extractTextFromStringifiedTiptap(article.body),
      author: article.author.userId,
      tags: article.tags.toArray().map(tag => tag.name),
      category: article.category,
      locationName: article.locationName,
      id: article.articleId.toString(),
      createdAt: article.createdAt.toString(),
    };
  }
}
