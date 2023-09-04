import type { TenantOrganizeType } from '@okampus/shared/enums';
import type { Team } from '../../team/team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { CampusCluster } from '../campus-cluster/campus-cluster.entity';

export type TenantOrganizeOptions = TenantScopedOptions & {
  campusCluster: CampusCluster;
  team: Team;
  type: TenantOrganizeType;
};
