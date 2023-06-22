import type { CampusProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Address } from '../../actor/address/address.entity';
import type { CampusCluster } from '../campus-cluster/campus-cluster.entity';

export type CampusOptions = CampusProps &
  TenantScopedOptions & {
    address: Address;
    campusCluster: CampusCluster;
  };
