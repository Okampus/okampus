import type { TenantRoleProps } from './tenant-role.props';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { TeamRoleType } from '@okampus/shared/enums';

export type TenantRoleOptions = TenantRoleProps &
  TenantScopedOptions & {
    type?: TeamRoleType;
    canViewHidden?: boolean;
    canHide?: boolean;
    canCreateTeam?: boolean;
    canManageCampus?: boolean;
    canManageEventApprovalSteps?: boolean;
    canManageEventApprovals?: boolean;
  };
