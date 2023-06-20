import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { AddressProps } from '@okampus/shared/dtos';
import type { Actor } from '../actor.entity';

export type AddressOptions = AddressProps &
  TenantScopedOptions & {
    actor: Actor;
  };
