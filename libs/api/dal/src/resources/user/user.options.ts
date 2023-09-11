import type { ActorOptions } from '../actor/actor.options';
import type { UserProps } from './user.props';
import type { TenantScopedOptions } from '../tenant-scoped.entity';
import type { TenantRoleType } from '@okampus/shared/enums';

export type UserOptions = UserProps &
  ActorOptions &
  TenantScopedOptions & {
    passwordHash?: string;
    role?: TenantRoleType;
  };
