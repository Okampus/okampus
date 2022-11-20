/* eslint-disable import/no-cycle */
import {
  Entity,
  OneToOne,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { User } from '../users/user.entity';

@Entity()
export class Statistics extends BaseEntity {
  @OneToOne({ primary: true })
  user!: User;

  @Property()
  postCount = 0;

  @Property()
  lastPost: Date | null = null;

  @Property()
  postStreak = 0;

  @Property()
  replyCount = 0;

  @Property()
  lastReply: Date | null = null;

  @Property()
  replyStreak = 0;

  @Property()
  commentCount = 0;

  @Property()
  lastComment: Date | null = null;

  @Property()
  commentStreak = 0;

  @Property()
  uploadCount = 0;

  @Property()
  lastAction: Date | null = null;

  @Property()
  actionStreak = 0;

  [PrimaryKeyType]: number;

  constructor(options: {
    user: User;
  }) {
    super();
    this.assign(options);
  }
}
