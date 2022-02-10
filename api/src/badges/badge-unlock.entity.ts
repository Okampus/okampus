import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { User } from '../users/user.entity';
import { Badge } from './badge.entity';

@Entity()
export class BadgeUnlock extends BaseEntity {
  @PrimaryKey()
  badgeUnlockId!: number;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @ManyToOne({ onDelete: 'CASCADE' })
  badge!: Badge;

  @Property()
  unlockDate = new Date();

  constructor(options: {
    user: User;
    badge: Badge;
  }) {
    super();
    this.user = options.user;
    this.badge = options.badge;
  }
}
