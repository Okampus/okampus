import {
  Entity,
  Enum,
  Index,
  ManyToOne,
} from '@mikro-orm/core';
import { Reply } from '../../replies/entities/reply.entity';
import { User } from '../../users/user.entity';
import { ReplyReaction as ReplyReactionEnum } from '../reaction.enum';
import { Reaction } from './reaction.entity';

@Entity()
export class ReplyReaction extends Reaction {
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  reply!: Reply;

  @Enum()
  @Index()
  value!: ReplyReactionEnum;

  constructor(reply: Reply, user: User, value: ReplyReactionEnum) {
    super(user);
    this.reply = reply;
    this.value = value;
  }
}
