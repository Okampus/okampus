import {
  Entity,
  OneToOne,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/lib/entities/base.entity';
// eslint-disable-next-line import/no-cycle
import { User } from '../users/user.entity';

@Entity()
export class Statistics extends BaseEntity {
  @OneToOne({ primary: true })
  user!: User;

  @Property()
  postCount = 0;

  @Property()
  lastPost?: Date;

  @Property()
  postStreak = 0;

  @Property()
  replyCount = 0;

  @Property()
  lastReply?: Date;

  @Property()
  replyStreak = 0;

  @Property()
  commentCount = 0;

  @Property()
  lastComment?: Date;

  @Property()
  commentStreak = 0;

  @Property()
  uploadCount = 0;

  @Property()
  lastAction?: Date;

  @Property()
  actionStreak = 0;

  [PrimaryKeyType]: number;

  constructor(options: { user: User }) {
    super();
    this.user = options.user;
  }
}
