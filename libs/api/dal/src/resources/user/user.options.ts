import type { ActorOptions } from '../actor/actor.options';
import type { Tag } from '../actor/tag/tag.entity';
import type { UserProps } from './user.props';
import type { TenantScopedOptions } from '../tenant-scoped.options';

export type UserOptions = UserProps &
  ActorOptions &
  TenantScopedOptions & {
    tags?: Tag[];
    passwordHash?: string;
  };
