import { RoleProps } from '@okampus/shared/dtos';
import { TeamRoleKey } from '@okampus/shared/enums';
import { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { Team } from '../org/team/team.entity';

export type RoleOptions = RoleProps &
  TenantScopedOptions & {
    team: Team;
    key?: TeamRoleKey | null;
    required?: boolean;
  };
