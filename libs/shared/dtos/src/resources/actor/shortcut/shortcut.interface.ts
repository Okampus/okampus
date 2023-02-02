import { ShortcutType } from '@okampus/shared/enums';
import { ITenantScoped } from '../../tenant-scoped.interface';
import { IActor } from '../actor.interface';
import { IUser } from '../user/user.interface';

export type IShortcut = ITenantScoped & {
  type: ShortcutType;
  user?: IUser;
  targetActor?: IActor;
};
