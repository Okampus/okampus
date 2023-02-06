import type { ShortcutType } from '@okampus/shared/enums';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { IActor } from '../actor.interface';
import type { IUser } from '../user/user.interface';

export type IShortcut = ITenantScoped & {
  type: ShortcutType;
  user?: IUser;
  targetActor?: IActor;
};
