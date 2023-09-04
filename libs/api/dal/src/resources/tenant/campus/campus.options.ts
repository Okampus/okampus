import type { Location } from '../../location/location.entity';
import type { CampusProps } from './campus.props';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { CampusCluster } from '../campus-cluster/campus-cluster.entity';

export type CampusOptions = CampusProps &
  TenantScopedOptions & {
    location: Location;
    campusCluster: CampusCluster;
  };
