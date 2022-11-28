/* eslint-disable import/no-cycle */
import {
  Cascade,
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
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
import { GraphQLJSON } from 'graphql-scalars';
import { BaseEntity } from '@common/lib/entities/base.entity';
import { EventState } from '@common/lib/types/enums/event-state.enum';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import { Team } from '@modules/org/teams/team.entity';
import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import { EventRegistration } from '@modules/plan/registrations/registration.entity';
import { User } from '@modules/uaa/users/user.entity';

@ObjectType()
@Entity()
export class Event extends BaseEntity {
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

  @Field(() => [EventRegistration])
  @OneToMany('EventRegistration', 'event')
  registrations = new Collection<EventRegistration>(this);

  @Field()
  @Property({ type: 'text' })
  location!: string;

  @Field(() => TeamMember, { nullable: true })
  @ManyToOne({ type: TeamMember, nullable: true })
  supervisor: TeamMember | null = null;

  @Field(() => Boolean)
  @Property()
  @Index()
  private = false;

  @Field(() => EventState)
  @Enum(() => EventState)
  state = EventState.Submitted;

  @Field(() => ApprovalStep, { nullable: true })
  @ManyToOne({ type: TeamForm, nullable: true })
  lastApprovalStep: ApprovalStep | null = null;

  @Field(() => TeamForm, { nullable: true })
  @OneToOne({ type: TeamForm, nullable: true, cascade: [Cascade.ALL] })
  registrationForm: TeamForm | null = null;

  @Field(() => Event, { nullable: true })
  @ManyToOne()
  usedTemplate: Event | null = null;

  @Field(() => GraphQLJSON)
  @Property({ type: 'json' })
  meta: object[] | object = {};

  @Field(() => GraphQLJSON)
  @Property({ type: 'json' })
  eventApprovalSubmission: object[] | object = {};

  constructor(options: {
    start: Date;
    end: Date;
    name: string;
    description: string;
    createdBy: User;
    team: Team;
    location: string;
    usedTemplate?: Event | null;
    meta?: object[] | object | null;
    registrationForm?: TeamForm | null;
    state?: EventState | null;
    price?: number | null;
    supervisor?: TeamMember | null;
    private?: boolean | null;
  }) {
    super();
    this.assign(options);

    // This.approvalStep = this.state === EventState.Submitted ? 1 : 0;
  }

  public canEdit(user: User): boolean {
    return this.createdBy.id === user.id
      || this.supervisor?.user?.id === user.id
      || this.team.canAdminister(user);
  }
}
