import { Entity, ManyToOne } from '@mikro-orm/core';
import { Vote } from '../../shared/modules/vote/vote.entity';
import { User } from '../../users/user.entity';
import { Post } from './post.entity';

@Entity({ discriminatorValue: 'post' })
export class PostVote extends Vote {
  @ManyToOne()
  post!: Post;

  constructor(post: Post, user: User, value: -1 | 1) {
    super(user, value);
    this.post = post;
  }
}
