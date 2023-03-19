/* eslint-disable import/no-cycle */
import { TenantScopedModel } from '../../index';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserCustomization, UserNotificationSettings, UserSettings, UserStats } from '@okampus/shared/dtos';
import type { IUserProfile } from '@okampus/shared/dtos';

@ObjectType()
export class UserProfileModel extends TenantScopedModel implements IUserProfile {
  @Field(() => UserCustomization)
  customization!: UserCustomization;

  @Field(() => UserStats)
  stats!: UserStats;

  @Field(() => UserSettings)
  settings!: UserSettings;

  @Field(() => UserNotificationSettings)
  notificationSettings!: UserNotificationSettings;

  @Field(() => Boolean)
  finishedIntroduction = false;

  @Field(() => Boolean)
  finishedOnboarding = false;

  constructor(profile: IUserProfile) {
    if (!profile.tenant) throw new Error('UserProfile must have a tenant');
    super(profile.tenant);
    Object.assign(this, profile);
  }
}
