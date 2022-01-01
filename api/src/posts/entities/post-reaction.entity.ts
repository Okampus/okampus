import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { Reaction } from '../../shared/modules/reaction/reaction.entity';
import { PostReaction as PostReactionEnum } from '../../shared/modules/reaction/reaction.enum';
import { User } from '../../users/user.entity';
import { Post } from './post.entity';

@Entity()
export class PostReaction extends Reaction {
  @ManyToOne({ onDelete: 'CASCADE' })
  post!: Post;

  @Enum()
  value!: PostReactionEnum;

  constructor(post: Post, user: User, value: PostReactionEnum) {
    super(user);
    this.post = post;
    this.value = value;
  }
}
