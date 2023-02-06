import type { RoleProps } from '@okampus/shared/dtos';
import type { TeamRoleKey } from '@okampus/shared/enums';
import type { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { Team } from '../org/team/team.entity';

export type RoleOptions = RoleProps &
  TenantScopedOptions & {
    team: Team;
    key?: TeamRoleKey | null;
    required?: boolean;
  };
