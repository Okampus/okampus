import { UserCustomization } from '../../../embeds/user-customization.embed';
import { UserNotificationSettings } from '../../../embeds/user-notification-settings.embed';
import { UserSettings } from '../../../embeds/user-settings.embed';
import { UserStats } from '../../../embeds/user-stats.embed';
import { ITenantScoped } from '../../tenant-scoped.interface';

export type IUserProfile = ITenantScoped & {
  customization: UserCustomization;
  stats: UserStats;
  settings: UserSettings;
  notificationSettings: UserNotificationSettings;
  finishedIntroduction: boolean;
  finishedOnboarding: boolean;
};