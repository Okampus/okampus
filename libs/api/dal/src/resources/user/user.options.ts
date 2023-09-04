import type { ActorOptions } from '../actor/actor.options';
import type { UserProps } from './user.props';
import type { TenantScopedOptions } from '../tenant-scoped.entity';

export type UserOptions = UserProps &
  ActorOptions &
  TenantScopedOptions & {
    passwordHash?: string;
  };
