import type { UserCustomization } from '../../../embeds/user-customization.embed';
import type { UserNotificationSettings } from '../../../embeds/user-notification-settings.embed';
import type { UserSettings } from '../../../embeds/user-settings.embed';
import type { UserStats } from '../../../embeds/user-stats.embed';
import type { ITenantScoped } from '../../tenant-scoped.interface';

export type IUserProfile = ITenantScoped & {
  customization: UserCustomization;
  stats: UserStats;
  settings: UserSettings;
  notificationSettings: UserNotificationSettings;
  finishedIntroduction: boolean;
  finishedOnboarding: boolean;
};
