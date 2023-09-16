import type { TenantRoleProps } from './tenant-role.props';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { TenantRoleType } from '@okampus/shared/enums';

export type TenantRoleOptions = TenantRoleProps &
  TenantScopedOptions & {
    type?: TenantRoleType;
    canViewHidden?: boolean;
    canHide?: boolean;
    canCreateTeam?: boolean;
    canManageCampus?: boolean;
    canManageEventApprovalSteps?: boolean;
    canManageEventApprovals?: boolean;
    canManageTenant?: boolean;
  };
