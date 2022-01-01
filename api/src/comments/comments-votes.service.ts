import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assertPermission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { User } from '../users/user.entity';
import { CommentVote } from './entities/comment-vote.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentVotesService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: BaseRepository<Comment>,
    @InjectRepository(CommentVote) private readonly commentVotesRepository: BaseRepository<CommentVote>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async upvote(user: User, commentId: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ commentId }, ['author', 'post', 'reply']);
    if (!comment)
      throw new NotFoundException('Comment not found');

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, comment);

    const oldVote = await this.commentVotesRepository.findOne({ comment, user });
    if (oldVote?.value)
      return comment;

    // Update pivot table
    const newVote = new CommentVote(comment, user);
    await this.commentVotesRepository.persistAndFlush(newVote);

    // Update comment
    comment.upvotes++;
    await this.commentRepository.flush();

    return comment;
  }

  public async neutralize(user: User, commentId: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ commentId }, ['author', 'post', 'reply']);
    if (!comment)
      throw new NotFoundException('Comment not found');

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, comment);

    // Update pivot table
    const oldVote = await this.commentVotesRepository.findOne({ comment, user });
    if (!oldVote)
      return comment;
    await this.commentVotesRepository.removeAndFlush(oldVote);

    // Update comment
    comment.upvotes--;
    await this.commentRepository.flush();

    return comment;
  }
}
