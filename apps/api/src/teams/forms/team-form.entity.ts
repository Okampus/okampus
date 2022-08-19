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
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamFormType } from '../../shared/lib/types/enums/team-form-type.enum';
// eslint-disable-next-line import/no-cycle
import { User } from '../../users/user.entity';
// eslint-disable-next-line import/no-cycle
import { Team } from '../teams/team.entity';

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
