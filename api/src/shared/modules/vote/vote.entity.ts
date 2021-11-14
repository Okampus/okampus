import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { User } from '../../../users/user.entity';
import { BaseEntity } from '../../lib/entities/base.entity';

@Entity({
  discriminatorColumn: 'kind',
  abstract: true,
})
export abstract class Vote extends BaseEntity {
  @PrimaryKey()
  voteId!: number;

  @Enum()
  kind!: 'comment' | 'post' | 'reply';

  @ManyToOne()
  user!: User;

  @Enum()
  value!: -1 | 1;

  constructor(user: User, value: -1 | 1) {
    super();
    this.user = user;
    this.value = value;
  }
}
