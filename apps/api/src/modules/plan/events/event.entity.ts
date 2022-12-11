/* eslint-disable import/no-cycle */
import type { EntityManager } from '@mikro-orm/core';
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
import type { Faker } from '@mikro-orm/seeder';
import { Factory } from '@mikro-orm/seeder';
import {
  Field,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { BaseTenantEntity } from '@common/lib/entities/base-tenant.entity';
import { EventState } from '@common/lib/types/enums/event-state.enum';
import { randomInt } from '@common/lib/utils/random-utils';
import { Paginated } from '@common/modules/pagination';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import { Team } from '@modules/org/teams/team.entity';
import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import type { Tenant } from '@modules/org/tenants/tenant.entity';
import { EventRegistration } from '@modules/plan/registrations/registration.entity';
import { User } from '@modules/uaa/users/user.entity';
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
  }

  public canEdit(user: User): boolean {
    return this.createdBy.id === user.id
      || this.supervisor?.user?.id === user.id
      || this.team.canAdminister(user);
  }
}

@ObjectType()
export class PaginatedEvent extends Paginated(Event) {}

export class EventFactory extends Factory<Event> {
  tenant: Tenant;
  team: Team;
  steps: ApprovalStep[];
  model = Event;

  constructor(em: EntityManager, team: Team, steps: ApprovalStep[]) {
    super(em);
    this.tenant = team.tenant;
    this.team = team;
    this.steps = steps;
  }

  public definition(faker: Faker): Partial<Event> {
    const start = faker.date.future();
    const end = new Date(start.getDate() + 1000 * 60 * 60 * 2);
    const submitted = Math.random() > 0.5;
    let state = Math.random() > 0.5 ? EventState.Template : EventState.Draft;
    let step = null;
    if (submitted) {
      step = this.steps[randomInt(0, this.steps.length - 1)];
      state = step === this.steps[this.steps.length - 1]
        ? EventState.Published
        : Math.random() > 0.2 ? EventState.Rejected : EventState.Submitted;
    }
    // Let state = submitted ? (Math.random() > 0.5: EventState.Submitted) : EventState.Draft;

    return {
      tenant: this.tenant,
      name: faker.lorem.words(3),
      description: faker.lorem.paragraphs(3),
      start,
      end,
      team: this.team,
      price: randomInt(0, 100),
      location: faker.address.streetAddress(),
      state,
      lastApprovalStep: step,
    };
  }
}
