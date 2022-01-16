import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assertPermission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { User } from '../users/user.entity';
import type { NoArticleVote } from './entities/article-vote.entity';
import { ArticleVote } from './entities/article-vote.entity';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleVotesService {
  constructor(
    @InjectRepository(Article) private readonly articleRepository: BaseRepository<Article>,
    @InjectRepository(ArticleVote) private readonly articleVotesRepository: BaseRepository<ArticleVote>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async findVote(user: User, articleId: number): Promise<ArticleVote | NoArticleVote> {
    const article = await this.articleRepository.findOneOrFail({ articleId }, ['author', 'tags']);

    // TODO: Maybe the user won't have access to this article. There can be some restrictions
    // (i.e. "personal"/"sensitive" articles)

    return await this.articleVotesRepository.findOne({ article, user }, ['article', 'article.tags', 'article.author']) ?? { article, user, value: 0 };
  }

  public async update(user: User, postId: number, value: -1 | 1): Promise<Article> {
    const article = await this.articleRepository.findOneOrFail({ articleId: postId }, ['author', 'tags']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, article);

    let vote = await this.articleVotesRepository.findOne({ article, user });
    const previousValue = vote?.value;
    if (previousValue === value)
      return article;

    // Update pivot table
    if (vote)
      vote.value = value;
    else
      vote = new ArticleVote(article, user, value);
    await this.articleVotesRepository.persistAndFlush(vote);

    // Update article
    if (value === 1)
      article.upvotes++;
    else if (value === -1)
      article.downvotes++;

    if (value === 1 && previousValue === -1)
      article.downvotes--;
    else if (value === -1 && previousValue === 1)
      article.upvotes--;

    await this.articleRepository.flush();
    return article;
  }

  public async neutralize(user: User, postId: number): Promise<Article> {
    const article = await this.articleRepository.findOneOrFail({ articleId: postId }, ['author', 'tags']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, article);

    // Update pivot table
    const oldVote = await this.articleVotesRepository.findOne({ article, user });
    if (!oldVote)
      return article;
    await this.articleVotesRepository.removeAndFlush(oldVote);

    // Update article
    if (oldVote?.value === 1)
      article.upvotes--;
    else if (oldVote?.value === -1)
      article.downvotes--;

    await this.articleRepository.flush();
    return article;
  }
}
