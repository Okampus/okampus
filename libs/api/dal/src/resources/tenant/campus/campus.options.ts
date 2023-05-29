import type { CampusProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { ActorAddress } from '../../actor/actor-address/actor-address.entity';

export type CampusOptions = CampusProps &
  TenantScopedOptions & {
    address: ActorAddress;
  };
