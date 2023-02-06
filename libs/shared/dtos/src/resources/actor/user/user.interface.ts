import type { IIndividual } from '../individual/individual.interface';
import type { IShortcut } from '../shortcut/shortcut.interface';
import type { IUserProfile } from '../user-profile/user-profile.interface';
import type { UserProps } from './user.props';

export interface IUser extends IIndividual, UserProps {
  profile?: IUserProfile;
  shortcuts?: IShortcut[];
}
