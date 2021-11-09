import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { User } from '../../../users/user.entity';

@Entity({
  discriminatorColumn: 'kind',
  abstract: true,
})
export abstract class Vote {
  @PrimaryKey()
  voteId!: number;

  @Enum()
  kind!: 'comment' | 'post' | 'reply';

  @ManyToOne()
  user!: User;

  @Enum()
  value!: -1 | 1;

  @Property()
  @Exclude()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Exclude()
  updatedAt: Date = new Date();

  constructor(user: User, value: -1 | 1) {
    this.user = user;
    this.value = value;
  }
}
