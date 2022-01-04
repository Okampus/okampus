import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assertPermission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { User } from '../users/user.entity';
import { ArticleVote } from './entities/article-vote.entity';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleVotesService {
  constructor(
    @InjectRepository(Article) private readonly postRepository: BaseRepository<Article>,
    @InjectRepository(ArticleVote) private readonly postVotesRepository: BaseRepository<ArticleVote>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async update(user: User, postId: number, value: -1 | 1): Promise<Article> {
    const article = await this.postRepository.findOneOrFail({ articleId: postId }, ['tags']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, article);

    let vote = await this.postVotesRepository.findOne({ article, user });
    const previousValue = vote?.value;
    if (previousValue === value)
      return article;

    // Update pivot table
    if (vote)
      vote.value = value;
    else
      vote = new ArticleVote(article, user, value);
    await this.postVotesRepository.persistAndFlush(vote);

    // Update article
    if (value === 1)
      article.upvotes++;
    else if (value === -1)
      article.downvotes++;

    if (value === 1 && previousValue === -1)
      article.downvotes--;
    else if (value === -1 && previousValue === 1)
      article.upvotes--;

    await this.postRepository.flush();
    return article;
  }

  public async neutralize(user: User, postId: number): Promise<Article> {
    const article = await this.postRepository.findOneOrFail({ articleId: postId }, ['tags']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, article);

    // Update pivot table
    const oldVote = await this.postVotesRepository.findOne({ article, user });
    if (!oldVote)
      return article;
    await this.postVotesRepository.removeAndFlush(oldVote);

    // Update article
    if (oldVote?.value === 1)
      article.upvotes--;
    else if (oldVote?.value === -1)
      article.downvotes--;

    await this.postRepository.flush();
    return article;
  }
}
