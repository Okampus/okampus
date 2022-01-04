import { Index, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { User } from '../../users/user.entity';

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
