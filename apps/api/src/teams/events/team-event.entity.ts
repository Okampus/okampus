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
  supervisor?: User;

  @Field(() => Boolean)
  @Property()
  @Index()
  private = false;

  @Field(() => TeamEventState)
  @Enum({ items: () => TeamEventState, default: TeamEventState.Published })
  state = TeamEventState.Published;

  @Field(() => TeamForm, { nullable: true })
  @OneToOne({ cascade: [Cascade.ALL] })
  form?: TeamForm | null = null;

  @Field(() => TeamEvent, { nullable: true })
  @ManyToOne()
  usedTemplate?: TeamEvent | null = null;

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
    usedTemplate?: TeamEvent;
    meta?: object;
    form?: TeamForm;
    state?: TeamEventState;
    price?: number;
    supervisor?: User;
    private?: boolean;
  }) {
    super();
    this.start = options.start;
    this.end = options.end;
    this.name = options.name;
    this.description = options.description;
    this.createdBy = options.createdBy;
    this.team = options.team;
    this.place = options.place;

    if (options.usedTemplate)
      this.usedTemplate = options.usedTemplate;
    if (options.meta)
      this.meta = options.meta;
    if (options.form)
      this.form = options.form;
    if (options.state)
      this.state = options.state;
    if (typeof options.price !== 'undefined')
      this.price = options.price;
    if (options.supervisor)
      this.supervisor = options.supervisor;
    if (typeof options.private !== 'undefined')
      this.private = options.private;
  }

  public canEdit(user: User): boolean {
    return this.createdBy.id === user.id
      || this.supervisor?.id === user.id
      || this.team.canAdminister(user);
  }
}
