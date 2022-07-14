import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import {
  Field,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
// eslint-disable-next-line import/no-cycle
import { User } from '../../users/user.entity';
import { Badge } from './badge.entity';

@ObjectType()
@Entity()
export class BadgeUnlock extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  badgeUnlockId!: number;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @Field(() => Badge)
  @ManyToOne({ onDelete: 'CASCADE' })
  badge!: Badge;

  @Field(() => GraphQLISODateTime)
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
