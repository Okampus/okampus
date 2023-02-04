import type { RoleKind, TeamRoleKey } from '@okampus/shared/enums';
import type { ITenantScoped } from '../tenant-scoped.interface';
import type { RoleProps } from './role.props';

export type IRole = ITenantScoped &
  RoleProps & {
    roleKind: RoleKind;
    key: TeamRoleKey | null;
    required: boolean;
  };
