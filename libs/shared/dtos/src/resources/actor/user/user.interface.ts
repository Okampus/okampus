import type { ITeamJoin } from '../../join/team-join/team-join.interface';
import type { ITeamMember } from '../../membership/team-member/team-member.interface';
import type { IIndividual } from '../individual/individual.interface';
import type { IShortcut } from '../shortcut/shortcut.interface';
import type { IUserProfile } from '../user-profile/user-profile.interface';
import type { UserProps } from './user.props';

export interface IUser extends IIndividual, Required<UserProps> {
  profile?: IUserProfile;
  shortcuts?: IShortcut[];
  teamMemberships?: ITeamMember[];
  teamJoins?: ITeamJoin[];
}
