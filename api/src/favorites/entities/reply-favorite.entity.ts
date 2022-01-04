import { Entity, Index, OneToOne } from '@mikro-orm/core';
import { Reply } from '../../replies/entities/reply.entity';
import { User } from '../../users/user.entity';
import { Favorite } from './favorite.entity';

@Entity({ discriminatorValue: 'reply' })
export class ReplyFavorite extends Favorite {
  @OneToOne({ onDelete: 'CASCADE' })
  @Index()
  reply!: Reply;

  constructor(reply: Reply, user: User) {
    super(user);
    this.reply = reply;
  }
}
