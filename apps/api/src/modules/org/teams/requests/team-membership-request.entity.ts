/* eslint-disable import/no-cycle */
import {
  Entity,
  Enum,
  Index,
  ManyToOne,
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
import { MembershipRequestState } from '@common/lib/types/enums/membership-request-state.enum';
import { TeamRole } from '@common/lib/types/enums/team-role.enum';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import { User } from '@modules/uua/users/user.entity';
import { MembershipRequestIssuer } from '../../../../common/lib/types/enums/membership-request-issuer.enum';
import { Team } from '../team.entity';

@ObjectType()
@Entity()
export class TeamMembershipRequest extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => Team)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  team!: Team;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @Field(() => MembershipRequestIssuer)
  @Enum(() => MembershipRequestIssuer)
  issuer!: MembershipRequestIssuer;

  @Field(() => MembershipRequestState)
  @Enum(() => MembershipRequestState)
  @Index()
  state = MembershipRequestState.Pending;

  @Field(() => TeamRole)
  @Enum(() => TeamRole)
  role = TeamRole.Member;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  handledBy: User | null = null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Property()
  handledAt: Date | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  handledMessage: string | null = null;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  issuedBy!: User;

  @Field(() => TeamForm, { nullable: true })
  @ManyToOne(() => TeamForm, { nullable: true, onDelete: 'CASCADE' })
  originalForm: TeamForm | null = null;

  @Field(() => GraphQLJSON, { nullable: true })
  @Property({ type: 'json' })
  formSubmission: object[] | object | null = null;

  constructor(options: {
    team: Team;
    user: User;
    issuer: MembershipRequestIssuer;
    issuedBy: User;
    originalForm?: TeamForm | null;
    formSubmission?: object[] | object | null;
    handledMessage?: string | null;
    role?: TeamRole | null;
  }) {
    super();
    this.assign(options);
  }
}