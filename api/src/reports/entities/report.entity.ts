import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { User } from '../../users/user.entity';

@Entity({
  discriminatorColumn: 'kind',
  abstract: true,
})
export abstract class Report extends BaseEntity {
  @PrimaryKey()
  reportId!: number;

  @Enum()
  @Exclude()
  kind!: 'article' | 'comment' | 'post' | 'reply';

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @Property({ type: 'text' })
  reason!: string;

  constructor(options: {
    user: User;
    reason: string;
  }) {
    super();
    this.user = options.user;
    this.reason = options.reason;
  }
}
