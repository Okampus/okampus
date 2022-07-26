import {
  Cascade,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import {
  Field,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { JSONObjectResolver } from 'graphql-scalars';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamEventState } from '../../shared/lib/types/enums/team-event-state.enum';
import { User } from '../../users/user.entity';
import { TeamForm } from '../forms/team-form.entity';
import { Team } from '../teams/team.entity';

@ObjectType()
@Entity()
export class TeamEvent extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => GraphQLISODateTime)
  @Property()
  start!: Date;

  @Field(() => GraphQLISODateTime)
  @Property()
  end!: Date;

  @Field()
  @Property()
  name!: string;

  @Field()
  @Property({ type: 'text' })
  description!: string;

  @Field(() => Number)
  @Property()
  price = 0;

  @Field(() => User)
  @ManyToOne()
  createdBy!: User;

  @Field(() => Team)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  team!: Team;

  @Field()
  @Property({ type: 'text' })
  place!: string;

  @Field(() => User, { nullable: true })
  @ManyToOne()
  supervisor: User | null = null;

  @Field(() => Boolean)
  @Property()
  @Index()
  private = false;

  @Field(() => TeamEventState)
  @Enum({ items: () => TeamEventState })
  state = TeamEventState.Submitted;

  @Field(() => Int)
  @Property()
  validationStep = 0;

  @Field(() => TeamForm, { nullable: true })
  @OneToOne({ cascade: [Cascade.ALL] })
  form: TeamForm | null = null;

  @Field(() => TeamEvent, { nullable: true })
  @ManyToOne()
  usedTemplate: TeamEvent | null = null;

  @Field(() => JSONObjectResolver)
  @Property({ type: 'json' })
  meta: object = {};

  constructor(options: {
    start: Date;
    end: Date;
    name: string;
    description: string;
    createdBy: User;
    team: Team;
    place: string;
    usedTemplate?: TeamEvent | null;
    meta?: object | null;
    form?: TeamForm | null;
    state?: TeamEventState | null;
    price?: number | null;
    supervisor?: User | null;
    private?: boolean | null;
  }) {
    super();
    this.assign(options);

    this.validationStep = this.state === TeamEventState.Submitted ? 1 : 0;
  }

  public canEdit(user: User): boolean {
    return this.createdBy.id === user.id
      || this.supervisor?.id === user.id
      || this.team.canAdminister(user);
  }
}
