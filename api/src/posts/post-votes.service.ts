import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assertPermission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { User } from '../users/user.entity';
import type { NoPostVote } from './entities/post-vote.entity';
import { PostVote } from './entities/post-vote.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class PostVotesService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: BaseRepository<Post>,
    @InjectRepository(PostVote) private readonly postVotesRepository: BaseRepository<PostVote>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async findVote(user: User, postId: number): Promise<NoPostVote | PostVote> {
    const post = await this.postRepository.findOneOrFail({ postId }, ['author', 'tags', 'assignees']);

    // TODO: Maybe the user won't have access to this post. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)

    return await this.postVotesRepository.findOne({ post, user }) ?? { post, user, value: 0 };
  }

  public async update(user: User, postId: number, value: -1 | 1): Promise<Post> {
    const post = await this.postRepository.findOneOrFail({ postId }, ['author', 'tags', 'assignees']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, post);

    let vote = await this.postVotesRepository.findOne({ post, user });
    const previousValue = vote?.value;
    if (previousValue === value)
      return post;

    // Update pivot table
    if (vote)
      vote.value = value;
    else
      vote = new PostVote(post, user, value);
    await this.postVotesRepository.persistAndFlush(vote);

    // Update post
    if (value === 1)
      post.upvotes++;
    else if (value === -1)
      post.downvotes++;

    if (value === 1 && previousValue === -1)
      post.downvotes--;
    else if (value === -1 && previousValue === 1)
      post.upvotes--;

    await this.postRepository.flush();
    return post;
  }

  public async neutralize(user: User, postId: number): Promise<Post> {
    const post = await this.postRepository.findOneOrFail({ postId }, ['author', 'tags', 'assignees']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, post);

    // Update pivot table
    const oldVote = await this.postVotesRepository.findOne({ post, user });
    if (!oldVote)
      return post;
    await this.postVotesRepository.removeAndFlush(oldVote);

    // Update post
    if (oldVote?.value === 1)
      post.upvotes--;
    else if (oldVote?.value === -1)
      post.downvotes--;

    await this.postRepository.flush();
    return post;
  }
}
