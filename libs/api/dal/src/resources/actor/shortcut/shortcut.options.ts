import type { ShortcutProps } from '@okampus/shared/dtos';
import type { Actor } from '../actor.entity';
import type { User } from '../user/user.entity';
import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';

export type ShortcutOptions = ShortcutProps &
  TenantScopedOptions & {
    user: User;
    targetActor: Actor;
  };
