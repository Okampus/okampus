import type { Actor } from '../../actor/actor.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';

export type FollowOptions = TenantScopedOptions & {
  actor: Actor;
};
