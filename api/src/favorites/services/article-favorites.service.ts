import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Article } from '../../articles/entities/article.entity';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import type { PaginationOptions } from '../../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import type { User } from '../../users/user.entity';
import { ArticleFavorite } from '../entities/article-favorite.entity';

@Injectable()
export class ArticleFavoritesService {
  constructor(
    @InjectRepository(ArticleFavorite) private readonly articleFavoriteRepository: BaseRepository<ArticleFavorite>,
    @InjectRepository(Article) private readonly articleRepository: BaseRepository<Article>,
  ) {}

  public async create(articleId: number, user: User): Promise<ArticleFavorite> {
    const article = await this.articleRepository.findOneOrFail({ articleId });

    const favorite = new ArticleFavorite(article, user);
    try {
      await this.articleFavoriteRepository.persistAndFlush(favorite);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Article is already favorited');
      throw error;
    }
    return favorite;
  }

  public async findAll(user: User, paginationOptions?: PaginationOptions): Promise<PaginatedResult<ArticleFavorite>> {
    return await this.articleFavoriteRepository.findWithPagination(
      paginationOptions,
      { user, kind: 'article' },
      { populate: ['article', 'article.tags', 'article.author'] },
    );
  }

  public async findOne(articleId: number, user: User): Promise<ArticleFavorite> {
    return await this.articleFavoriteRepository.findOneOrFail({ article: { articleId }, user }, { populate: ['article', 'article.tags', 'article.author'] });
  }

  public async remove(articleId: number, user: User): Promise<void> {
    const favorite = await this.articleFavoriteRepository.findOneOrFail({ article: { articleId }, user });
    await this.articleFavoriteRepository.removeAndFlush(favorite);
  }
}
