import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { UserProfileProps } from './user-profile.props';

export type IUserProfile = ITenantScoped & Required<UserProfileProps>;
