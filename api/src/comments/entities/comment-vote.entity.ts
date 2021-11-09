import { Entity, OneToOne } from '@mikro-orm/core';
import { Vote } from '../../shared/modules/vote/vote.entity';
import { User } from '../../users/user.entity';
import { Comment } from './comment.entity';

@Entity({ discriminatorValue: 'comment' })
export class CommentVote extends Vote {
  @OneToOne()
  comment!: Comment;

  constructor(comment: Comment, user: User, value: -1 | 1) {
    super(user, value);
    this.comment = comment;
  }
}
