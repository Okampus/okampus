import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamEventRegisterStatus } from '../../shared/lib/types/enums/team-event-register-status.enum';
import { User } from '../../users/user.entity';
import { TeamEvent } from '../events/team-event.entity';
import { TeamForm } from '../forms/team-form.entity';

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
  @ManyToOne()
  originalForm: TeamForm | null = null;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Property({ type: 'json' })
  formSubmission: object | null = null;

  constructor(options: {
    event: TeamEvent;
    user: User;
    status: TeamEventRegisterStatus;
    originalForm?: TeamForm | null;
    formSubmission?: object | null;
  }) {
    super();
    this.assign(options);
  }
}
