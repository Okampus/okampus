import type { CampusCluster } from './campus-cluster.entity';
import type { CampusClusterProps } from './campus-cluster.props';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type CampusClusterOptions = CampusClusterProps &
  TenantScopedOptions & {
    campusClusters?: CampusCluster[];
  };
