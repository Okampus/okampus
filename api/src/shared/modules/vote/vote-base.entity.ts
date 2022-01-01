import { Enum } from '@mikro-orm/core';
import type { User } from '../../../users/user.entity';
import { BaseVoteBase } from './base-vote-base.entity';

export abstract class VoteBase extends BaseVoteBase {
  @Enum()
  value!: -1 | 1;

  constructor(user: User, value: -1 | 1) {
    super(user);
    this.value = value;
  }
}
