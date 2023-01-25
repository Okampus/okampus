import { IIndividual } from '../individual/individual.interface';
import { IUserProfile } from '../user-profile/user-profile.interface';
import { UserProps } from './user.props';

export interface IUser extends IIndividual, UserProps {
  profile?: IUserProfile;
}
