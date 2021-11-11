import { Entity, ManyToOne } from '@mikro-orm/core';
import { Vote } from '../../shared/modules/vote/vote.entity';
import { User } from '../../users/user.entity';
import { Comment } from './comment.entity';

@Entity({ discriminatorValue: 'comment' })
export class CommentVote extends Vote {
  @ManyToOne()
  comment!: Comment;

  constructor(comment: Comment, user: User, value: -1 | 1) {
    super(user, value);
    this.comment = comment;
  }
}
