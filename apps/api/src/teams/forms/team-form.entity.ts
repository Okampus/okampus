import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { JSONObjectResolver } from 'graphql-scalars';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
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

  @Field()
  @Property({ type: 'text' })
  description?: string;

  @Field(() => JSONObjectResolver)
  @Property({ type: 'json' })
  form!: object;

  @Field()
  @ManyToOne()
  createdBy!: User;

  @Field(() => Team)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  team!: Team;

  @Field()
  @Property()
  isTemplate: boolean;

  constructor(options: {
    name: string;
    form: object;
    isTemplate: boolean;
    createdBy: User;
    team: Team;
    description?: string;
  }) {
    super();
    this.name = options.name;
    this.form = options.form;
    this.createdBy = options.createdBy;
    this.team = options.team;
    this.isTemplate = options.isTemplate;

    if (options.description)
      this.description = options.description;
  }
}
