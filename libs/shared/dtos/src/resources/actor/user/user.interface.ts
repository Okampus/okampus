import type { UserCustomization } from '../../../embeds/user-customization.embed';
import type { UserNotificationSettings } from '../../../embeds/user-notification-settings.embed';
import type { UserSettings } from '../../../embeds/user-settings.embed';
import type { UserStats } from '../../../embeds/user-stats.embed';
import type { ITeamJoin } from '../../join/team-join/team-join.interface';
import type { ITeamMember } from '../../membership/team-member/team-member.interface';
import type { IIndividual } from '../individual/individual.interface';
import type { IShortcut } from '../shortcut/shortcut.interface';
import type { UserProps } from './user.props';

export interface IUser extends IIndividual, Required<UserProps> {
  finishedIntroduction: boolean;
  finishedOnboarding: boolean;
  customization: UserCustomization;
  notificationSettings: UserNotificationSettings;
  settings: UserSettings;
  stats: UserStats;
  shortcuts?: IShortcut[];
  teamMemberships?: ITeamMember[];
  teamJoins?: ITeamJoin[];
}
