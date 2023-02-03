import { RoleKind, TeamRoleKey } from '@okampus/shared/enums';
import { ITenantScoped } from '../tenant-scoped.interface';
import { RoleProps } from './role.props';

export type IRole = ITenantScoped &
  RoleProps & {
    roleKind: RoleKind;
    key: TeamRoleKey | null;
    required: boolean;
  };
