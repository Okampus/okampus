import { Entity, Index, OneToOne } from '@mikro-orm/core';
import { Post } from '../../posts/entities/post.entity';
import type { User } from '../../users/user.entity';
import { Report } from './report.entity';

@Entity({ discriminatorValue: 'post' })
export class PostReport extends Report {
  @OneToOne({ onDelete: 'CASCADE' })
  @Index()
  post!: Post;

  constructor(options: {
    post: Post;
    user: User;
    reason: string;
  }) {
    super(options);
    this.post = options.post;
  }
}
