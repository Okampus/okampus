import { ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { User } from '../../../users/user.entity';
import { BaseEntity } from '../../lib/entities/base.entity';

export abstract class BaseVoteBase extends BaseEntity {
  @PrimaryKey()
  voteId!: number;

  @ManyToOne()
  user!: User;

  constructor(user: User) {
    super();
    this.user = user;
  }
}
