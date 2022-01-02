import { Index, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { User } from '../../../users/user.entity';
import { BaseEntity } from '../../lib/entities/base.entity';

export abstract class Reaction extends BaseEntity {
  @PrimaryKey()
  reactionId!: number;

  @ManyToOne()
  @Index()
  user!: User;

  constructor(user: User) {
    super();
    this.user = user;
  }
}
