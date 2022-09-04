import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { InterestState } from '../../shared/lib/types/enums/interest-state.enum';
import { User } from '../../users/user.entity';
import { Team } from '../teams/team.entity';

@ObjectType()
@Entity()
export class Interest extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => InterestState)
  @Property()
  state!: InterestState;

  @Field(() => String)
  @Property()
  message!: string;

  @Field(() => Team)
  @ManyToOne()
  team!: Team;

  @Field(() => User)
  @ManyToOne()
  user!: User;

  constructor(options: {
    state: InterestState;
    message: string;
    team: Team;
    user: User;
  }) {
    super();
    this.assign(options);
  }
}
