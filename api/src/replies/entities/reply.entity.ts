import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { Post } from '../../posts/entities/post.entity';
import { Content } from '../../shared/lib/entities/content.entity';
import type { User } from '../../users/user.entity';

@Entity()
export class Reply extends Content {
  @PrimaryKey()
  replyId: string = nanoid(10);

  @ManyToOne({ onDelete: 'cascade' })
  post!: Post;

  constructor(options: {
    post: Post;
    body: string;
    author: User;
  }) {
    super(options);
    this.post = options.post;
  }
}
