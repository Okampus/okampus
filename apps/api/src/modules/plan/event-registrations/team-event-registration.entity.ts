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
import { TeamEventRegisterStatus } from '@common/lib/types/enums/team-event-register-status.enum';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import { User } from '@modules/uua/users/user.entity';
import { TeamEvent } from '../events/team-event.entity';

@ObjectType()
@Entity()
export class TeamEventRegistration extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => TeamEvent)
  @ManyToOne({ onDelete: 'CASCADE' })
  event!: TeamEvent;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  user!: User;

  @Field(() => TeamEventRegisterStatus)
  @Enum(() => TeamEventRegisterStatus)
  status!: TeamEventRegisterStatus;

  @Field(() => Boolean)
  @Property()
  present = false;

  @Field(() => Int)
  @Property()
  participationScore = 0;

  @Field(() => TeamForm, { nullable: true })
  @ManyToOne({ type: TeamForm, nullable: true })
  originalForm: TeamForm | null = null;

  @Field(() => GraphQLJSON, { nullable: true })
  @Property({ type: 'json' })
  formSubmission: object[] | object | null = null;

  constructor(options: {
    event: TeamEvent;
    user: User;
    status: TeamEventRegisterStatus;
    originalForm?: TeamForm | null;
    formSubmission?: object[] | object | null;
  }) {
    super();
    this.assign(options);
  }
}
