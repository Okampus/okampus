import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { VoteBase } from '../../shared/modules/vote/vote-base.entity';
import { User } from '../../users/user.entity';
import { Reply } from './reply.entity';

@Entity()
export class ReplyVote extends VoteBase {
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  reply!: Reply;

  constructor(reply: Reply, user: User, value: -1 | 1) {
    super(user, value);
    this.reply = reply;
  }
}
