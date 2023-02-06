import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  UserCustomization,
  UserNotificationSettings,
  UserSettings,
  UserStats,
} from '@okampus/shared/dtos';
import type {
  ITenantCore,
  IUserProfile} from '@okampus/shared/dtos';

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
    super(profile.tenant as ITenantCore);
    Object.assign(this, profile);
  }
}
