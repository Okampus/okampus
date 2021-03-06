import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
// eslint-disable-next-line import/no-cycle
import { User } from '../../users/user.entity';
import { Badge } from './badge.entity';

@ObjectType()
@Entity()
export class BadgeUnlock extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @Field(() => Badge)
  @ManyToOne({ onDelete: 'CASCADE' })
  badge!: Badge;

  constructor(options: {
    user: User;
    badge: Badge;
  }) {
    super();
    this.assign(options);
  }
}
