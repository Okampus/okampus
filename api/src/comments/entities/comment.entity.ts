import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { Post } from '../../posts/entities/post.entity';
import { Reply } from '../../replies/entities/reply.entity';
import { Content } from '../../shared/lib/entities/content.entity';
import type { User } from '../../users/user.entity';

@Entity()
export class Comment extends Content {
  @PrimaryKey()
  commentId: string = nanoid(10);

  @ManyToOne({ onDelete: 'cascade' })
  post!: Post;

  @ManyToOne({ onDelete: 'cascade' })
  // FIXME: this is optional
  reply!: Reply;

  constructor(options: {
    post: Post;
    reply: Reply;
    body: string;
    author: User;
  }) {
    super(options);
    this.post = options.post;
    this.reply = options.reply;
  }
}
