import type { Actor } from '../actor.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type FollowOptions = TenantScopedOptions & {
  actor: Actor;
};
