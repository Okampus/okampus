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
import { Paginated } from '@common/modules/pagination';
import { BaseTenantEntity } from '@lib/entities/base-tenant.entity';
import { EventState } from '@lib/types/enums/event-state.enum';
import { EventRegistration } from '@plan/registrations/registration.entity';
import { TeamForm } from '@teams/forms/team-form.entity';
import { TeamMember } from '@teams/members/team-member.entity';
import { Team } from '@teams/team.entity';
import { ApprovalStep } from '@tenants/approval-steps/approval-step.entity';
import { User } from '@uaa/users/user.entity';
import { CreateEventDto } from './dto/create-event.dto';

@ObjectType()
@Entity()
export class Event extends BaseTenantEntity {
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

  @Field()
  @Property({ type: 'text' })
  location!: string;

  @Field(() => EventState)
  @Enum(() => EventState)
  state = EventState.Submitted;

  @Field(() => GraphQLJSON)
  @Property({ type: 'json' })
  meta: object[] | object = {};

  @Field(() => User)
  @ManyToOne()
  createdBy!: User;

  @Field(() => Team)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  team!: Team;

  @Field(() => TeamMember, { nullable: true })
  @ManyToOne({ type: TeamMember, nullable: true })
  supervisor: TeamMember | null = null;

  @Field(() => Boolean)
  @Property()
  @Index()
  private = false;

  @Field(() => ApprovalStep, { nullable: true })
  @ManyToOne({ type: TeamForm, nullable: true })
  lastApprovalStep: ApprovalStep | null = null;

  @Field(() => TeamForm, { nullable: true })
  @OneToOne({ type: TeamForm, nullable: true, cascade: [Cascade.ALL] })
  registerForm: TeamForm | null = null;

  @Field(() => Event, { nullable: true })
  @ManyToOne()
  template: Event | null = null;

  @Field(() => GraphQLJSON)
  @Property({ type: 'json' })
  eventApprovalSubmission: object[] | object = {};

  @Field(() => [EventRegistration])
  @OneToMany('EventRegistration', 'event')
  registrations = new Collection<EventRegistration>(this);

  // eslint-disable-next-line max-params
  constructor(
    options: CreateEventDto,
    createdBy: User | null = null,
    supervisor: TeamMember | null = null,
    team: Team | null = null,
    template: Event | null = null,
    registerForm: TeamForm | null = null,
  ) {
    super();
    this.assign({
      ...options, supervisor, createdBy, team, template, registerForm,
    });

    // This.approvalStep = this.state === EventState.Submitted ? 1 : 0;
  }

  public canEdit(user: User): boolean {
    return this.createdBy.id === user.id
      || this.supervisor?.user?.id === user.id
      || this.team.canAdminister(user);
  }
}

@ObjectType()
export class PaginatedEvent extends Paginated(Event) {}
