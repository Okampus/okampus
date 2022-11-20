/* eslint-disable import/no-cycle */
import {
  Entity,
  OneToOne,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { NotificationChannel } from '../../shared/lib/types/enums/notification-channel.enum';
import { User } from '../users/user.entity';

const week = 7 * 24 * 60 * 60;

const MAIL = NotificationChannel.Mail;
const IN_APP = NotificationChannel.InApp;
const PUSH = NotificationChannel.Push;

@ObjectType()
@Entity()
export class Settings extends BaseEntity {
  @Field(() => User)
  @OneToOne({ primary: true })
  user!: User;

  //
  // GDPR
  //

  /** Export my data via the main email when my account is deactivated */
  @Field(() => Boolean)
  @Property()
  gdprEndOfLifeExport = true;

  /** Anonymize my data when my account is deactivated */
  @Field(() => Boolean)
  @Property()
  gdprEndOfLifeAnonymize = false;

  //
  // Mention notifications
  //

  /** I was mentionned */
  @Field(() => Int)
  @Property()
  notificationMentionned: number = IN_APP | PUSH;

  //
  // Badge notifications
  //

  /** I unlocked a badge */
  @Field(() => Int)
  @Property()
  notificationBadgeUnlocked: number = IN_APP;

  //
  // Blog notifications
  //

  /** A blog I subscribe to is updated */
  @Field(() => Int)
  @Property()
  notificationBlogSubscribedUpdated: number = MAIL | IN_APP;

  //
  // Content notifications
  //

  /** A content I wrote has been deleted */
  @Field(() => Int)
  @Property()
  notificationContentRemoved: number = IN_APP;

  //
  // Report notifications
  //

  /** A report has been created */
  @Field(() => Int)
  @Property()
  notificationAdminReportCreated: number = IN_APP;

  //
  // Team notifications
  //

  /** A team publishes an event */
  @Field(() => Int)
  @Property()
  notificationTeamEventCreated: number = IN_APP;

  /** A team to which I am subscribed (member) publishes an event */
  @Field(() => Int)
  @Property()
  notificationTeamSubscribedEventCreated: number = IN_APP | PUSH;

  /** A form has been added/modified/deleted on a team I manage (board) */
  @Field(() => Int)
  @Property()
  notificationTeamManagedFormUpdated: number = IN_APP;

  /** An event has been added/modified/deleted on a team I manage (board) */
  @Field(() => Int)
  @Property()
  notificationTeamManagedEventUpdated: number = IN_APP;

  /** A membership request has been created/modified on a team I manage (board) */
  @Field(() => Int)
  @Property()
  notificationTeamManagedMembershipRequestUpdated: number = MAIL | IN_APP;

  /** The role of a member has been modified on a team I manage (board) */
  @Field(() => Int)
  @Property()
  notificationTeamManagedMemberRoleUpdated: number = MAIL | IN_APP;

  /** ADMIN: A team adds/updates/deletes one of its socials */
  @Field(() => Int)
  @Property()
  notificationAdminTeamSocialUpdated: number = IN_APP;

  /** ADMIN: A team adds/updates/deletes a legal document */
  @Field(() => Int)
  @Property()
  notificationAdminTeamLegalFileUpdated: number = IN_APP;

  //
  // Team Event notifications
  //

  /** An event to which I am subscribed (registered/supervisor) is updated */
  // TODO: more granularity : price updated/place update/is-private updated...
  @Field(() => Int)
  @Property()
  notificationTeamEventSubscribedUpdated: number = IN_APP;

  /** An event that I manage (creator/supervisor/board) is approved */
  @Field(() => Int)
  @Property()
  notificationTeamEventManagedApproved: number = MAIL | IN_APP | PUSH;

  /** An event I manage (creator/supervisor/board) is rejected */
  @Field(() => Int)
  @Property()
  notificationTeamEventManagedRejected: number = MAIL | IN_APP | PUSH;

  /** An event I manage (creator/supervisor/board) has a new registrant */
  @Field(() => Int)
  @Property()
  notificationTeamEventManagedRegistrationCreated: number = IN_APP;

  /** ADMIN: An event was submitted for validation */
  @Field(() => Int)
  @Property()
  notificationAdminTeamEventValidationStarted: number = MAIL | IN_APP;

  /** ADMIN: An event submitted for validation has reached a stage for which I am responsible */
  @Field(() => Int)
  @Property()
  notificationAdminTeamEventValidationStep: number = MAIL | IN_APP;

  /** ADMIN: An event is approved */
  @Field(() => Int)
  @Property()
  notificationAdminTeamEventValidationApproved: number = IN_APP;

  /** ADMIN: An event is rejected */
  @Field(() => Int)
  @Property()
  notificationAdminTeamEventValidationRejected: number = IN_APP;

  //
  // Thread notifications
  //

  /** A thread to which I am subscribed is updated */
  // TODO: more granularity : new reply/new reply by admin/new comment/new comment by admin/new assignee..
  @Field(() => Int)
  @Property()
  notificationThreadSubscribedUpdated: number = MAIL | IN_APP | PUSH;

  /** A thread to which I am subscribed has a validated reply */
  @Field(() => Int)
  @Property()
  notificationThreadSubscribedAnswered: number = MAIL | IN_APP | PUSH;

  /** ADMIN: A thread is without a validated response and inactive since X time */
  @Field(() => Int)
  @Property()
  notificationAdminThreadStale: number = MAIL | IN_APP;

  /** ADMIN: Time after which I am notified for notificationThreadStale if it is enabled */
  @Field(() => Int)
  @Property()
  notificationAdminThreadStaleThreshold: number = 2 * week;

  /** ADMIN: A thread to which I am assigned is without a validated response and inactive for X time */
  @Field(() => Int)
  @Property()
  notificationAdminThreadAssignedStale: number = MAIL | IN_APP;

  /** ADMIN: Time after which I am notified for notificationAdminThreadAssignedStale if it is enabled */
  @Field(() => Int)
  @Property()
  notificationAdminThreadAssignedStaleThreshold: number = week;

  /** ADMIN: I have been assigned to a thread */
  @Field(() => Int)
  @Property()
  notificationAdminThreadAssigned: number = MAIL | IN_APP | PUSH;

  //
  // User notifications
  //

  /** My role was updated (includes role AND schoolRole) */
  @Field(() => Int)
  @Property()
  notificationRoleUpdated: number = IN_APP;

  /** ADMIN: The role of somebody has been updated (includes role AND schoolRole) */
  @Field(() => Int)
  @Property()
  notificationAdminRoleUpdated: number = IN_APP;

  [PrimaryKeyType]: number;

  constructor(options: {
    user: User;
  }) {
    super();
    this.assign(options);
  }
}
