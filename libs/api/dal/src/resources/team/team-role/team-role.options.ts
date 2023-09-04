import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { Team } from '../team.entity';
import type { TeamRoleType } from '@okampus/shared/enums';
import type { TeamRoleProps } from './team-role.props';

export type TeamRoleOptions = TeamRoleProps &
  TenantScopedOptions & {
    team: Team;
    type?: TeamRoleType;
    isLocked?: boolean;
  };
