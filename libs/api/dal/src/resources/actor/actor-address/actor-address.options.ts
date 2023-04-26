import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { ActorAddressProps } from '@okampus/shared/dtos';
import type { Actor } from '../actor.entity';

export type ActorAddressOptions = ActorAddressProps &
  TenantScopedOptions & {
    actor: Actor;
  };
