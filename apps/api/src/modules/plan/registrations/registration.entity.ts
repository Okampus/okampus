/* eslint-disable import/no-cycle */
import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { BaseEntity } from '@common/lib/entities/base.entity';
import { EventRegisterStatus } from '@common/lib/types/enums/event-register-status.enum';
import { Paginated } from '@common/modules/pagination';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import { User } from '@modules/uaa/users/user.entity';
import { Event } from '../events/event.entity';

@ObjectType()
@Entity()
export class EventRegistration extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => Event)
  @ManyToOne({ onDelete: 'CASCADE' })
  event!: Event;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  user!: User;

  @Field(() => EventRegisterStatus)
  @Enum(() => EventRegisterStatus)
  status!: EventRegisterStatus;

  @Field(() => Boolean)
  @Property()
  present = false;

  @Field(() => Int)
  @Property()
  activityScore = 0;

  @Field(() => TeamForm, { nullable: true })
  @ManyToOne({ type: TeamForm, nullable: true })
  originalForm: TeamForm | null = null;

  @Field(() => GraphQLJSON, { nullable: true })
  @Property({ type: 'json' })
  formSubmission: object[] | object | null = null;

  constructor(options: {
    event: Event;
    user: User;
    status: EventRegisterStatus;
    originalForm?: TeamForm | null;
    formSubmission?: object[] | object | null;
  }) {
    super();
    this.assign(options);
  }
}

@ObjectType()
export class PaginatedEventRegistration extends Paginated(EventRegistration) {}
