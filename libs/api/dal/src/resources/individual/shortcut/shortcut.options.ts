import type { Actor } from '../../actor/actor.entity';
import type { ShortcutProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { User } from '../user/user.entity';

export type ShortcutOptions = ShortcutProps &
  TenantScopedOptions & {
    user: User;
    targetActor: Actor;
  };
