import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { UpvoteBase } from '../../shared/modules/vote/upvote-base.entity';
import { User } from '../../users/user.entity';
import { Comment } from './comment.entity';

@Entity()
export class CommentVote extends UpvoteBase {
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  comment!: Comment;

  constructor(comment: Comment, user: User) {
    super(user);
    this.comment = comment;
  }
}
