import { Entity, ManyToOne } from '@mikro-orm/core';
import { Vote } from '../../shared/modules/vote/vote.entity';
import { User } from '../../users/user.entity';
import { Reply } from './reply.entity';

@Entity({ discriminatorValue: 'reply' })
export class ReplyVote extends Vote {
  @ManyToOne()
  reply!: Reply;

  constructor(reply: Reply, user: User, value: -1 | 1) {
    super(user, value);
    this.reply = reply;
  }
}
