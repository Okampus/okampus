import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { assertPermissions } from '../../shared/lib/utils/assertPermission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { ArticleReaction as ArticleReactionEnum } from '../../shared/modules/reaction/reaction.enum';
import type { User } from '../../users/user.entity';
import { ArticleReaction } from '../entities/article-reaction.entity';
import { Article } from '../entities/article.entity';

@Injectable()
export class ArticleReactionsService {
  constructor(
    @InjectRepository(Article) private readonly postRepository: BaseRepository<Article>,
    @InjectRepository(ArticleReaction) private readonly postReactionsRepository: BaseRepository<ArticleReaction>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async findAll(postId: number): Promise<ArticleReaction[]> {
    // TODO: Maybe the user won't have access to this article. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    const article = await this.postRepository.findOneOrFail({ articleId: postId });
    return await this.postReactionsRepository.find({ article }, ['user', 'article']);
  }

  public async add(user: User, postId: number, reaction: ArticleReactionEnum): Promise<ArticleReaction> {
    const article = await this.postRepository.findOneOrFail({ articleId: postId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, article);

    const entity = await this.postReactionsRepository.findOne({ article, user, value: reaction });
    if (entity)
      return entity;

    const newReaction = new ArticleReaction(article, user, reaction);
    await this.postReactionsRepository.persistAndFlush(newReaction);
    return newReaction;
  }

  public async remove(user: User, postId: number, reaction: ArticleReactionEnum): Promise<void> {
    const article = await this.postRepository.findOneOrFail({ articleId: postId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, article);

    const reactionEntity = await this.postReactionsRepository.findOneOrFail({ article, user, value: reaction });
    await this.postReactionsRepository.removeAndFlush(reactionEntity);
  }
}
