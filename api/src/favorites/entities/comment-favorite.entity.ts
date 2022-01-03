import { Entity, Index, OneToOne } from '@mikro-orm/core';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/user.entity';
import { Favorite } from './favorite.entity';

@Entity({ discriminatorValue: 'comment' })
export class CommentFavorite extends Favorite {
  @OneToOne({ onDelete: 'CASCADE' })
  @Index()
  comment!: Comment;

  constructor(comment: Comment, user: User) {
    super(user);
    this.comment = comment;
  }
}
