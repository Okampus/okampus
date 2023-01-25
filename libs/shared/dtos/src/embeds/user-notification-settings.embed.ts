import { Embeddable, Enum, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { NotificationChannel } from '@okampus/shared/enums';
import { WEEK_DURATION_IN_SECONDS } from '@okampus/shared/consts';

const MAIL = NotificationChannel.Mail;
const IN_APP = NotificationChannel.InApp;
const PUSH = NotificationChannel.Push;

@ObjectType()
@Embeddable()
export class UserNotificationSettings {
  //
  // Mention notifications
  //

  /** I was mentionned */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationMentionned: number = IN_APP | PUSH;

  //
  // Badge notifications
  //

  /** I unlocked a badge */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationBadgeUnlocked: number = IN_APP;

  //
  // Blog notifications
  //

  /** A blog I subscribe to was updated */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationBlogSubscribedUpdated: number = MAIL | IN_APP;

  //
  // Content notifications
  //

  /** A content I wrote has been deleted */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationContentRemoved: number = IN_APP;

  //
  // Report notifications
  //

  /** A report has been created */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationAdminReportCreated: number = IN_APP;

  //
  // Team notifications
  //

  /** A team publishes an event */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationEventCreated: number = IN_APP;

  /** A team to which I am subscribed (member) publishes an event */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationTeamSubscribedEventCreated: number = IN_APP | PUSH;

  /** A form has been added/modified/deleted on a team I manage (board) */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationTeamManagedFormUpdated: number = IN_APP;

  /** An event has been added/modified/deleted on a team I manage (board) */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationTeamManagedEventUpdated: number = IN_APP;

  /** A membership request has been created/modified on a team I manage (board) */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationTeamManagedMembershipRequestUpdated: number = MAIL | IN_APP;

  /** The role of a member has been modified on a team I manage (board) */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationTeamManagedMemberRoleUpdated: number = MAIL | IN_APP;

  /** ADMIN: A team adds/updates/deletes one of its socials */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationAdminTeamSocialUpdated: number = IN_APP;

  /** ADMIN: A team adds/updates/deletes a legal document */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationAdminTeamLegalFileUpdated: number = IN_APP;

  //
  // Team Event notifications
  //

  /** An event to which I am subscribed (registered/supervisor) is updated */
  // TODO: more granularity : price updated/place update/is-private updated...
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationEventSubscribedUpdated: number = IN_APP;

  /** An event that I manage (creator/supervisor/board) is approved */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationEventManagedApproved: number = MAIL | IN_APP | PUSH;

  /** An event I manage (creator/supervisor/board) is rejected */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationEventManagedRejected: number = MAIL | IN_APP | PUSH;

  /** An event I manage (creator/supervisor/board) has a new registrant */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationEventManagedRegistrationCreated: number = IN_APP;

  /** ADMIN: An event was submitted for validation */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationAdminEventValidationStarted: number = MAIL | IN_APP;

  /** ADMIN: An event submitted for validation has reached a stage for which I am responsible */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationAdminEventValidationStep: number = MAIL | IN_APP;

  /** ADMIN: An event is approved */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationAdminEventValidationApproved: number = IN_APP;

  /** ADMIN: An event is rejected */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationAdminEventValidationRejected: number = IN_APP;

  //
  // Thread notifications
  //

  /** A thread to which I am subscribed is updated */
  // TODO: more granularity : new reply/new reply by admin/new comment/new comment by admin/new assignee..
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationThreadSubscribedUpdated: number = MAIL | IN_APP | PUSH;

  /** A thread to which I am subscribed has a validated reply */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationThreadSubscribedAnswered: number = MAIL | IN_APP | PUSH;

  /** ADMIN: A thread is without a validated response and inactive since X time */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationAdminThreadStale: number = MAIL | IN_APP;

  /** ADMIN: Time after which I am notified for notificationThreadStale if it is enabled */
  @Field(() => Int)
  @Property({ type: 'int' })
  notificationAdminThreadStaleThreshold: number = 2 * WEEK_DURATION_IN_SECONDS;

  /** ADMIN: A thread to which I am assigned is without a validated response and inactive for X time */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationAdminThreadAssignedStale: number = MAIL | IN_APP;

  /** ADMIN: Time after which I am notified for notificationAdminThreadAssignedStale if it is enabled */
  @Field(() => Int)
  @Property({ type: 'int' })
  notificationAdminThreadAssignedStaleThreshold: number = WEEK_DURATION_IN_SECONDS;

  /** ADMIN: I have been assigned to a thread */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationAdminThreadAssigned: number = MAIL | IN_APP | PUSH;

  //
  // User notifications
  //

  /** My role was updated (includes role AND scopeRole) */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationRoleUpdated: number = IN_APP;

  /** ADMIN: The role of somebody has been updated (includes role AND scopeRole) */
  @Field(() => Int)
  @Enum(() => NotificationChannel)
  notificationAdminRoleUpdated: number = IN_APP;

  constructor(partial: Partial<UserNotificationSettings>) {
    Object.assign(this, partial);
  }
}
