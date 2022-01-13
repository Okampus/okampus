import { Entity, Index, OneToOne } from '@mikro-orm/core';
import { Reply } from '../../replies/entities/reply.entity';
import type { User } from '../../users/user.entity';
import { Report } from './report.entity';

@Entity({ discriminatorValue: 'reply' })
export class ReplyReport extends Report {
  @OneToOne({ onDelete: 'CASCADE' })
  @Index()
  reply!: Reply;

  constructor(options: {
    reply: Reply;
    user: User;
    reason: string;
  }) {
    super(options);
    this.reply = options.reply;
  }
}
