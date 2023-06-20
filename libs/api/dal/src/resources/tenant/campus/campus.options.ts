import type { CampusProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Address } from '../../actor/address/address.entity';

export type CampusOptions = CampusProps &
  TenantScopedOptions & {
    address: Address;
  };
