import {
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Content } from '../contents/entities/content.entity';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { User } from '../users/user.entity';

@Entity()
export class Report extends BaseEntity {
  @PrimaryKey()
  reportId!: number;

  @ManyToOne()
  @Index()
  reporter!: User;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @OneToOne({ onDelete: 'CASCADE' })
  @Index()
  content?: Content;

  @Property({ type: 'text' })
  reason?: string;

  constructor(options: {
    user: User;
    reporter: User;
    content?: Content | null;
    reason?: string | null;
  }) {
    super();
    this.user = options.user;
    this.reporter = options.reporter;
    if (options.content)
      this.content = options.content;
    if (options.reason)
      this.reason = options.reason;
  }
}
