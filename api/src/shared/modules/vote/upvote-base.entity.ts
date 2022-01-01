import { Enum } from '@mikro-orm/core';
import type { User } from '../../../users/user.entity';
import { BaseVoteBase } from './base-vote-base.entity';

export abstract class UpvoteBase extends BaseVoteBase {
  @Enum()
  value!: 1;

  constructor(user: User) {
    super(user);
    this.value = 1;
  }
}
