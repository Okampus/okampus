import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Post } from '../../posts/entities/post.entity';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { assertPermissions } from '../../shared/lib/utils/assertPermission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { User } from '../../users/user.entity';
import { PostReaction } from '../entities/post-reaction.entity';
import type { PostReaction as PostReactionEnum } from '../reaction.enum';

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
    const post = await this.postRepository.findOneOrFail({ postId });
    return await this.postReactionsRepository.find({ post }, ['user', 'post']);
  }

  public async add(user: User, postId: number, reaction: PostReactionEnum): Promise<PostReaction> {
    const post = await this.postRepository.findOneOrFail({ postId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, post);

    const entity = await this.postReactionsRepository.findOne({ post, user, value: reaction });
    if (entity)
      throw new BadRequestException('Reaction already added');

    const newReaction = new PostReaction(post, user, reaction);
    await this.postReactionsRepository.persistAndFlush(newReaction);
    return newReaction;
  }

  public async remove(user: User, postId: number, reaction: PostReactionEnum): Promise<void> {
    const post = await this.postRepository.findOneOrFail({ postId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, post);

    const reactionEntity = await this.postReactionsRepository.findOneOrFail({ post, user, value: reaction });
    await this.postReactionsRepository.removeAndFlush(reactionEntity);
  }
}
