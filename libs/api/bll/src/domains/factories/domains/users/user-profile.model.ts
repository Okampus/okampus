import { Field, ObjectType } from '@nestjs/graphql';
import {
  ITenantCore,
  IUserProfile,
  UserCustomization,
  UserNotificationSettings,
  UserSettings,
  UserStats,
} from '@okampus/shared/dtos';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';

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
