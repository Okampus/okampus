import { Entity, Index, OneToOne } from '@mikro-orm/core';
import { Comment } from '../../comments/entities/comment.entity';
import type { User } from '../../users/user.entity';
import { Report } from './report.entity';

@Entity({ discriminatorValue: 'comment' })
export class CommentReport extends Report {
  @OneToOne({ onDelete: 'CASCADE' })
  @Index()
  comment!: Comment;

  constructor(options: {
    comment: Comment;
    user: User;
    reason: string;
  }) {
    super(options);
    this.comment = options.comment;
  }
}
