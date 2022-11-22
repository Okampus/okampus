/* eslint-disable import/no-cycle */
import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { BaseEntity } from '@meta/shared/lib/entities/base.entity';
import { TeamFormType } from '@meta/shared/lib/types/enums/team-form-type.enum';
import { Team } from '@modules/org/teams/team.entity';
import { User } from '@modules/uua/users/user.entity';

@ObjectType()
@Entity()
export class TeamForm extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  name!: string;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  description: string | null = null;

  @Field(() => GraphQLJSON)
  @Property({ type: 'json' })
  schema!: object[] | object;

  @Field(() => TeamFormType)
  @Enum(() => TeamFormType)
  type: TeamFormType;

  @Field(() => User)
  @ManyToOne()
  createdBy!: User;

  @Field(() => Team)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  team!: Team;

  @Field()
  @Property()
  isTemplate!: boolean;

  constructor(options: {
    name: string;
    schema: object[] | object;
    isTemplate: boolean;
    type: TeamFormType;
    createdBy: User;
    team: Team;
    description?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
