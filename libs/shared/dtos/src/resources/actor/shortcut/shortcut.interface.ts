import { ITenantScopedEntity } from '../../tenant-scoped.interface';
import { IUser } from '../user/user.interface';

export type IShortcut = ITenantScopedEntity & {
  name: string;
  subroute: string;
  resourceId: string;
  user?: IUser;
};
