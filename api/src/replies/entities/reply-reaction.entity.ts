import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { Reaction } from '../../shared/modules/reaction/reaction.entity';
import { ReplyReaction as ReplyReactionEnum } from '../../shared/modules/reaction/reaction.enum';
import { User } from '../../users/user.entity';
import { Reply } from './reply.entity';

@Entity()
export class ReplyReaction extends Reaction {
  @ManyToOne({ onDelete: 'CASCADE' })
  reply!: Reply;

  @Enum()
  value!: ReplyReactionEnum;

  constructor(reply: Reply, user: User, value: ReplyReactionEnum) {
    super(user);
    this.reply = reply;
    this.value = value;
  }
}
