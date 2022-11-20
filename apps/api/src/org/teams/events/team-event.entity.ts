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
import { BaseEntity } from '../../../shared/lib/entities/base.entity';
import { TeamEventState } from '../../../shared/lib/types/enums/team-event-state.enum';
import { User } from '../../../uua/users/user.entity';
import { ValidationStep } from '../../tenants/validation-steps/validation-step.entity';
import { TeamEventRegistration } from '../event-registrations/team-event-registration.entity';
import { TeamForm } from '../forms/team-form.entity';
import { TeamMember } from '../members/team-member.entity';
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

  @Field(() => [TeamEventRegistration])
  @OneToMany('TeamEventRegistration', 'event')
  registrations = new Collection<TeamEventRegistration>(this);

  @Field()
  @Property({ type: 'text' })
  location!: string;

  @Field(() => TeamMember, { nullable: true })
  @ManyToOne()
  supervisor: TeamMember | null = null;

  @Field(() => Boolean)
  @Property()
  @Index()
  private = false;

  @Field(() => TeamEventState)
  @Enum(() => TeamEventState)
  state = TeamEventState.Submitted;

  @Field(() => ValidationStep, { nullable: true })
  @ManyToOne()
  lastValidationStep: ValidationStep | null = null;

  @Field(() => TeamForm, { nullable: true })
  @OneToOne({ cascade: [Cascade.ALL] })
  registrationForm: TeamForm | null = null;

  @Field(() => TeamEvent, { nullable: true })
  @ManyToOne()
  usedTemplate: TeamEvent | null = null;

  @Field(() => GraphQLJSON)
  @Property({ type: 'json' })
  meta: object[] | object = {};

  @Field(() => GraphQLJSON)
  @Property({ type: 'json' })
  eventValidationSubmission: object[] | object = {};

  constructor(options: {
    start: Date;
    end: Date;
    name: string;
    description: string;
    createdBy: User;
    team: Team;
    location: string;
    usedTemplate?: TeamEvent | null;
    meta?: object[] | object | null;
    registrationForm?: TeamForm | null;
    state?: TeamEventState | null;
    price?: number | null;
    supervisor?: TeamMember | null;
    private?: boolean | null;
  }) {
    super();
    this.assign(options);

    // This.validationStep = this.state === TeamEventState.Submitted ? 1 : 0;
  }

  public canEdit(user: User): boolean {
    return this.createdBy.id === user.id
      || this.supervisor?.user?.id === user.id
      || this.team.canAdminister(user);
  }
}
