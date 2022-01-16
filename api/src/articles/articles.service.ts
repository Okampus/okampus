import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assertPermission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { Tag } from '../tags/tag.entity';
import type { User } from '../users/user.entity';
import { ArticleSearchService } from './article-search.service';
import type { CreateArticleDto } from './dto/create-article.dto';
import type { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private readonly articleRepository: BaseRepository<Article>,
    @InjectRepository(Tag) private readonly tagRepository: BaseRepository<Tag>,
    private readonly articleSearchService: ArticleSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(user: User, createArticleDto: CreateArticleDto): Promise<Article> {
    const article = new Article({
      ...createArticleDto,
      slug: slugify(createArticleDto.slug ?? createArticleDto.title),
      location: createArticleDto?.location?.split(',').map(Number) as [lat: number, lon: number] | undefined,
      author: user,
    });
    const tags = await this.tagRepository.find({ name: { $in: createArticleDto.tags } });
    article.tags.add(...tags);
    await this.articleRepository.persistAndFlush(article);
    await this.articleSearchService.add(article);
    return article;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<Article>> {
    // TODO: Maybe the user won't have access to all articles. There can be some restrictions
    // (i.e. "personal"/"sensitive" articles)
    return await this.articleRepository.findWithPagination(paginationOptions, {}, { populate: ['author', 'tags'] });
  }

  public async findOne(articleId: number): Promise<Article> {
    // TODO: Maybe the user won't have access to this article. There can be some restrictions
    // (i.e. "personal"/"sensitive" articles)
    return await this.articleRepository.findOneOrFail({ articleId }, ['author', 'tags']);
  }

  public async update(user: User, postId: number, updatePostDto: UpdateArticleDto): Promise<Article> {
    const article = await this.articleRepository.findOneOrFail({ articleId: postId }, ['author', 'tags']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, article, Object.keys(updatePostDto));

    // If we try to unlock the article, then it is the only action that we can do.
    if (article.locked && updatePostDto?.locked === false)
      updatePostDto = { locked: false };

    const { tags: wantedTags, ...updatedProps } = updatePostDto;

    if (wantedTags) {
      if (wantedTags.length === 0) {
        article.tags.removeAll();
      } else {
        const tags = await this.tagRepository.find({ name: { $in: wantedTags } });
        article.tags.set(tags);
      }
    }

    if (updatedProps)
      wrap(article).assign(updatedProps);

    await this.articleRepository.flush();
    await this.articleSearchService.update(article);
    return article;
  }

  public async remove(user: User, articleId: number): Promise<void> {
    const article = await this.articleRepository.findOneOrFail({ articleId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, article);

    await this.articleRepository.removeAndFlush(article);
    await this.articleSearchService.remove(article.articleId.toString());
  }
}
