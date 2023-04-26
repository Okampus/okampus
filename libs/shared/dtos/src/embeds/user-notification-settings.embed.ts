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
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  mentionned: number = IN_APP | PUSH;

  //
  // Badge notifications
  //

  /** I unlocked a badge */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  badgeUnlocked: number = IN_APP;

  //
  // Blog notifications
  //

  /** A blog I subscribe to was updated */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  blogSubscribedUpdated: number = MAIL | IN_APP;

  //
  // Content notifications
  //

  /** A content I wrote has been deleted */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  contentRemoved: number = IN_APP;

  //
  // Report notifications
  //

  /** A report has been created */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  adminReportCreated: number = IN_APP;

  //
  // Team notifications
  //

  /** A team publishes an event */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  eventCreated: number = IN_APP;

  /** A team to which I am subscribed (member) publishes an event */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  teamSubscribedEventCreated: number = IN_APP | PUSH;

  /** A form has been added/modified/deleted on a team I manage (board) */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  teamManagedFormUpdated: number = IN_APP;

  /** An event has been added/modified/deleted on a team I manage (board) */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  teamManagedEventUpdated: number = IN_APP;

  /** A membership request has been created/modified on a team I manage (board) */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  teamManagedMembershipRequestUpdated: number = MAIL | IN_APP;

  /** The role of a member has been modified on a team I manage (board) */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  teamManagedMemberRoleUpdated: number = MAIL | IN_APP;

  /** ADMIN: A team adds/updates/deletes one of its socials */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  adminTeamSocialUpdated: number = IN_APP;

  /** ADMIN: A team adds/updates/deletes a legal document */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  adminTeamLegalFileUpdated: number = IN_APP;

  //
  // Team Event notifications
  //

  /** An event to which I am subscribed (registered/supervisor) is updated */
  // TODO: more granularity : price updated/place update/is-private updated...
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  eventSubscribedUpdated: number = IN_APP;

  /** An event that I manage (creator/supervisor/board) is approved */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  eventManagedApproved: number = MAIL | IN_APP | PUSH;

  /** An event I manage (creator/supervisor/board) is rejected */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  eventManagedRejected: number = MAIL | IN_APP | PUSH;

  /** An event I manage (creator/supervisor/board) has a new registrant */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  eventManagedRegistrationCreated: number = IN_APP;

  /** ADMIN: An event was submitted for validation */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  adminEventValidationStarted: number = MAIL | IN_APP;

  /** ADMIN: An event submitted for validation has reached a stage for which I am responsible */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  adminEventValidationStep: number = MAIL | IN_APP;

  /** ADMIN: An event is approved */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  adminEventValidationApproved: number = IN_APP;

  /** ADMIN: An event is rejected */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  adminEventValidationRejected: number = IN_APP;

  //
  // Thread notifications
  //

  /** A thread to which I am subscribed is updated */
  // TODO: more granularity : new reply/new reply by admin/new comment/new comment by admin/new assignee..
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  threadSubscribedUpdated: number = MAIL | IN_APP | PUSH;

  /** A thread to which I am subscribed has a validated reply */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  threadSubscribedAnswered: number = MAIL | IN_APP | PUSH;

  /** ADMIN: A thread is without a validated response and inactive since X time */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  adminThreadStale: number = MAIL | IN_APP;

  /** ADMIN: Time after which I am notified for threadStale if it is enabled */
  @Field(() => Int)
  @Property({ type: 'int' })
  adminThreadStaleThreshold: number = 2 * WEEK_DURATION_IN_SECONDS;

  /** ADMIN: A thread to which I am assigned is without a validated response and inactive for X time */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  adminThreadAssignedStale: number = MAIL | IN_APP;

  /** ADMIN: Time after which I am notified for adminThreadAssignedStale if it is enabled */
  @Field(() => Int)
  @Property({ type: 'int' })
  adminThreadAssignedStaleThreshold: number = WEEK_DURATION_IN_SECONDS;

  /** ADMIN: I have been assigned to a thread */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  adminThreadAssigned: number = MAIL | IN_APP | PUSH;

  //
  // User notifications
  //

  /** My role was updated (includes role AND scopeRole) */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  roleUpdated: number = IN_APP;

  /** ADMIN: The role of somebody has been updated (includes role AND scopeRole) */
  @Field(() => Int)
  @Enum({ items: () => NotificationChannel, type: 'smallint' })
  adminRoleUpdated: number = IN_APP;

  constructor(partial: Partial<UserNotificationSettings>) {
    Object.assign(this, partial);
  }
}
