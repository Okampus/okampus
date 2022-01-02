import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { assertPermissions } from '../../shared/lib/utils/assertPermission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { PostReaction as PostReactionEnum } from '../../shared/modules/reaction/reaction.enum';
import type { User } from '../../users/user.entity';
import { PostReaction } from '../entities/post-reaction.entity';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostReactionsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: BaseRepository<Post>,
    @InjectRepository(PostReaction) private readonly postReactionsRepository: BaseRepository<PostReaction>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async findAll(postId: number): Promise<PostReaction[]> {
    // TODO: Maybe the user won't have access to this post. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    const post = await this.postRepository.findOne({ postId });
    if (!post)
      throw new NotFoundException('Post not found');

    return await this.postReactionsRepository.find({ post }, ['user', 'post']);
  }

  public async add(user: User, postId: number, reaction: PostReactionEnum): Promise<PostReaction> {
    const post = await this.postRepository.findOne({ postId });
    if (!post)
      throw new NotFoundException('Post not found');

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, post);

    const entity = await this.postReactionsRepository.findOne({ post, user, value: reaction });
    if (entity)
      return entity;

    const newReaction = new PostReaction(post, user, reaction);
    await this.postReactionsRepository.persistAndFlush(newReaction);
    return newReaction;
  }

  public async remove(user: User, postId: number, reaction: PostReactionEnum): Promise<void> {
    const post = await this.postRepository.findOne({ postId });
    if (!post)
      throw new NotFoundException('Post not found');

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, post);

    const reactionEntity = await this.postReactionsRepository.findOne({ post, user, value: reaction });
    if (!reactionEntity)
      throw new NotFoundException('Reaction not found');

    await this.postReactionsRepository.removeAndFlush(reactionEntity);
  }
}
