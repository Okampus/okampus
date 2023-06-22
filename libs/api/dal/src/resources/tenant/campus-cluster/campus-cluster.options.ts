import type { CampusCluster } from './campus-cluster.entity';
import type { CampusClusterProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Address } from '../../actor/address/address.entity';

export type CampusClusterOptions = CampusClusterProps &
  TenantScopedOptions & {
    approximateAddress?: Address | null;
    campusClusters?: CampusCluster[];
  };
