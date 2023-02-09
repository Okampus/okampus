import type { RoleKind } from '@okampus/shared/enums';
import type { ITenantScoped } from '../tenant-scoped.interface';
import type { RoleProps } from './role.props';

export type IRole = ITenantScoped &
  RoleProps & {
    roleKind: RoleKind;
    required: boolean;
  };
