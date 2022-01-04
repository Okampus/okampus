import { Entity, Index, OneToOne } from '@mikro-orm/core';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/user.entity';
import { Favorite } from './favorite.entity';

@Entity({ discriminatorValue: 'post' })
export class PostFavorite extends Favorite {
  @OneToOne({ onDelete: 'CASCADE' })
  @Index()
  post!: Post;

  constructor(post: Post, user: User) {
    super(user);
    this.post = post;
  }
}
