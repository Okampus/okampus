import { applyDecorators } from '@nestjs/common';
import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { NotificationChannel } from '@meta/shared/lib/types/enums/notification-channel.enum';

const day = 24 * 60 * 60;

const maxBitwise = Object.values(NotificationChannel)
  .filter((value): value is number => typeof value === 'number')
  .reduce((acc, curr) => acc + curr, 0);

// TODO: Choose more carefully which are requried/optional
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IsOptionalNotifiationChannel = (): PropertyDecorator => applyDecorators(
  Field(() => Int, { nullable: true }),
  IsOptional(),
  IsInt(),
  Min(0),
  Max(maxBitwise),
);

const IsRequiredNotifiationChannel = (): PropertyDecorator => applyDecorators(
  Field(() => Int, { nullable: true }),
  IsOptional(),
  IsInt(),
  Min(1),
  Max(maxBitwise),
);

@InputType()
export class UpdateSettingsDto {
  // GDPR

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  gdprEndOfLifeExport: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  gdprEndOfLifeAnonymize: boolean;

  // Mention notifications

  @IsRequiredNotifiationChannel()
  notificationMentionned: number;

  // Badge notifications

  @IsRequiredNotifiationChannel()
  notificationBadgeUnlocked: number;

  // Blog notifications

  @IsRequiredNotifiationChannel()
  notificationBlogSubscribedUpdated: number;

  // Content notifications

  @IsRequiredNotifiationChannel()
  notificationContentRemoved: number;

  // Report notifications

  @IsRequiredNotifiationChannel()
  notificationAdminReportCreated: number;

  // Team notifications

  @IsRequiredNotifiationChannel()
  notificationTeamEventCreated: number;

  @IsRequiredNotifiationChannel()
  notificationTeamSubscribedEventCreated: number;

  @IsRequiredNotifiationChannel()
  notificationTeamManagedFormUpdated: number;

  @IsRequiredNotifiationChannel()
  notificationTeamManagedEventUpdated: number;

  @IsRequiredNotifiationChannel()
  notificationTeamManagedMembershipRequestUpdated: number;

  @IsRequiredNotifiationChannel()
  notificationTeamManagedMemberRoleUpdated: number;

  @IsRequiredNotifiationChannel()
  notificationAdminTeamContactUpdated: number;

  @IsRequiredNotifiationChannel()
  notificationAdminTeamLegalFileUpdated: number;

  // Team Event notifications

  @IsRequiredNotifiationChannel()
  notificationTeamEventSubscribedUpdated: number;

  @IsRequiredNotifiationChannel()
  notificationTeamEventManagedApproved: number;

  @IsRequiredNotifiationChannel()
  notificationTeamEventManagedRejected: number;

  @IsRequiredNotifiationChannel()
  notificationTeamEventManagedRegistrationCreated: number;

  @IsRequiredNotifiationChannel()
  notificationAdminTeamEventValidationStarted: number;

  @IsRequiredNotifiationChannel()
  notificationAdminTeamEventValidationStep: number;

  @IsRequiredNotifiationChannel()
  notificationAdminTeamEventValidationApproved: number;

  @IsRequiredNotifiationChannel()
  notificationAdminTeamEventValidationRejected: number;

  // Thread notifications

  @IsRequiredNotifiationChannel()
  notificationThreadSubscribedUpdated: number;

  @IsRequiredNotifiationChannel()
  notificationThreadSubscribedAnswered: number;

  @IsRequiredNotifiationChannel()
  notificationAdminThreadStale: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(day)
  notificationAdminThreadStaleThreshold: number;

  @IsRequiredNotifiationChannel()
  notificationAdminThreadAssignedStale: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(day)
  notificationAdminThreadAssignedStaleThreshold: number;

  @IsRequiredNotifiationChannel()
  notificationAdminThreadAssigned: number;

  // User notifications

  @IsRequiredNotifiationChannel()
  notificationRoleUpdated: number;

  @IsRequiredNotifiationChannel()
  notificationAdminRoleUpdated: number;
}
