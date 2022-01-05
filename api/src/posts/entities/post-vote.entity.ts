import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { VoteBase } from '../../shared/modules/vote/vote-base.entity';
import { User } from '../../users/user.entity';
import { Post } from './post.entity';

@Entity()
export class PostVote extends VoteBase {
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  post!: Post;

  constructor(post: Post, user: User, value: -1 | 1) {
    super(user, value);
    this.post = post;
  }
}

export interface NoPostVote {
  post: Post;
  user: User;
  value: 0;
}
