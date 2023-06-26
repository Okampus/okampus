import type { Location } from '../../actor/location/location.entity';
import type { CampusProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { CampusCluster } from '../campus-cluster/campus-cluster.entity';

export type CampusOptions = CampusProps &
  TenantScopedOptions & {
    location: Location;
    campusCluster: CampusCluster;
  };
