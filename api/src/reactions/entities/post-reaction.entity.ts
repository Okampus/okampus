import {
  Entity,
  Enum,
  Index,
  ManyToOne,
} from '@mikro-orm/core';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/user.entity';
import { PostReaction as PostReactionEnum } from '../reaction.enum';
import { Reaction } from './reaction.entity';

@Entity()
export class PostReaction extends Reaction {
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  post!: Post;

  @Enum()
  @Index()
  value!: PostReactionEnum;

  constructor(post: Post, user: User, value: PostReactionEnum) {
    super(user);
    this.post = post;
    this.value = value;
  }
}
