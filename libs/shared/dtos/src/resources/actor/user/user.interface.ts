import { IIndividual } from '../individual/individual.interface';
import type { IShortcut } from '../shortcut/shortcut.interface';
import { IUserProfile } from '../user-profile/user-profile.interface';
import { UserProps } from './user.props';

export interface IUser extends IIndividual, UserProps {
  profile?: IUserProfile;
  shortcuts?: IShortcut[];
}
