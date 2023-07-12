import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Team } from '../team.entity';
import type { TeamRoleType } from '@okampus/shared/enums';
import type { RoleProps } from '@okampus/shared/dtos';

export type RoleOptions = RoleProps &
  TenantScopedOptions & {
    team: Team;
    type?: TeamRoleType;
    isRequired?: boolean;
  };
