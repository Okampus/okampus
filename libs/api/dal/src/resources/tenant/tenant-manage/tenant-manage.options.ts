import type { Team } from '../../team/team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { CampusCluster } from '../campus-cluster/campus-cluster.entity';

export type TenantManageOptions = TenantScopedOptions & {
  campusCluster?: CampusCluster | null;
  team: Team;
};
