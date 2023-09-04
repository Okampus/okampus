import type { Actor } from '../../actor/actor.entity';
import type { ShortcutProps } from './shortcut.props';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { User } from '../user.entity';

export type ShortcutOptions = ShortcutProps &
  TenantScopedOptions & {
    user: User;
    targetActor: Actor;
  };
