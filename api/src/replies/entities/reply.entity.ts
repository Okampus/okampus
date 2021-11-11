import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { Comment } from '../../comments/entities/comment.entity';
import { Post } from '../../posts/entities/post.entity';
import { Content } from '../../shared/modules/content/content.entity';
import type { User } from '../../users/user.entity';

@Entity()
export class Reply extends Content {
  @PrimaryKey()
  replyId: string = nanoid(10);

  @ManyToOne({ onDelete: 'cascade' })
  post!: Post;

  @ManyToOne({ onDelete: 'cascade' })
  comment!: Comment;

  constructor(options: {
    post: Post;
    comment: Comment;
    body: string;
    author: User;
  }) {
    super(options);
    this.post = options.post;
    this.comment = options.comment;
  }
}
