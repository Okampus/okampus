import { UserCustomization } from '../../../embeds/user-customization.embed';
import { UserNotificationSettings } from '../../../embeds/user-notification-settings.embed';
import { UserSettings } from '../../../embeds/user-settings.embed';
import { UserStats } from '../../../embeds/user-stats.embed';
import { IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserProfileProps {
  @Field(() => UserCustomization, { nullable: true })
  @IsOptional()
  @IsObject()
  @Type(() => UserCustomization)
  customization?: UserCustomization;

  @Field(() => UserStats, { nullable: true })
  @IsOptional()
  @IsObject()
  @Type(() => UserStats)
  stats?: UserStats;

  @Field(() => UserSettings, { nullable: true })
  @IsOptional()
  @IsObject()
  @Type(() => UserSettings)
  settings?: UserSettings;

  @Field(() => UserNotificationSettings, { nullable: true })
  @IsOptional()
  @IsObject()
  @Type(() => UserNotificationSettings)
  notificationSettings?: UserNotificationSettings;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  finishedIntroduction?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  finishedOnboarding?: boolean;
}
