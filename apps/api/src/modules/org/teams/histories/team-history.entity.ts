/* eslint-disable import/no-cycle */
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@meta/shared/lib/entities/base.entity';
import { TeamHistoryState } from '@meta/shared/lib/types/enums/team-history-state.enum';
import { Team } from '../team.entity';

@ObjectType()
@Entity()
export class TeamHistory extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => Int, { nullable: true })
  @Property()
  day: number | null = null;

  @Field(() => Int, { nullable: true })
  @Property()
  month: number | null = null;

  @Field(() => Int)
  @Property()
  year!: number;

  @Field(() => String)
  @Property()
  name!: string;

  @Field(() => Team, { nullable: true })
  @ManyToOne()
  parent: Team | null = null;

  @Field(() => Team)
  @ManyToOne()
  team!: Team;

  @Field(() => TeamHistoryState)
  @Property()
  state!: TeamHistoryState;

  @Field(() => Boolean)
  @Property()
  active = true;

  constructor(options: {
    day?: number | null;
    month?: number | null;
    year: number;
    name: string;
    team: Team;
    parent?: Team | null;
    state: TeamHistoryState;
  }) {
    super();
    this.assign(options);
  }
}
