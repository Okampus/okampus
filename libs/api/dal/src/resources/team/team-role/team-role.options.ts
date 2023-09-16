import type { TeamRoleProps } from './team-role.props';
import type { Team } from '../team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { User } from '../../user/user.entity';
import type { TeamRoleType } from '@okampus/shared/enums';

export type TeamRoleOptions = TeamRoleProps &
  TenantScopedOptions & {
    manager?: User;
    team: Team;
    type?: TeamRoleType;
    isPole?: boolean;
    canViewTreasury?: boolean;
    canManageTreasury?: boolean;
    canManageProfile?: boolean;
    canViewJoins?: boolean;
    canManageJoins?: boolean;
    canManageDocuments?: boolean;
    canManageMemberRoles?: boolean;
    canManageRoles?: boolean;
    canCreateEvents?: boolean;
    canManageEvents?: boolean;
    canViewDraftEvents?: boolean;
    canCreateActions?: boolean;
    canManageActions?: boolean;
    canCreateContents?: boolean;
    canManageContents?: boolean;
  };
