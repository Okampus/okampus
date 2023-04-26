import type { Actor } from '../../actor/actor.entity';
import type { ShortcutProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { UserInfo } from '../user-info/user-info.entity';

export type ShortcutOptions = ShortcutProps &
  TenantScopedOptions & {
    userInfo: UserInfo;
    targetActor: Actor;
  };
