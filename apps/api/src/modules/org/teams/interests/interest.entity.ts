/* eslint-disable import/no-cycle */
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/modules/pagination';
import { BaseEntity } from '@lib/entities/base.entity';
import { InterestState } from '@lib/types/enums/interest-state.enum';
import { Team } from '@teams/team.entity';
import { User } from '@uaa/users/user.entity';

@ObjectType()
@Unique({ properties: ['team', 'user'] })
@Entity()
export class Interest extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => InterestState)
  @Property()
  state!: InterestState;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  message: string | null = null;

  @Field(() => Team)
  @ManyToOne()
  team!: Team;

  @Field(() => User)
  @ManyToOne()
  user!: User;

  constructor(options: {
    state: InterestState;
    message?: string | null;
    team: Team;
    user: User;
  }) {
    super();
    this.assign(options);
  }
}

@ObjectType()
export class PaginatedInterest extends Paginated(Interest) {}
