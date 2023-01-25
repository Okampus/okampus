import { RoleKind } from '@okampus/shared/enums';
import { ITenantScopedEntity } from '../tenant-scoped.interface';
import { RoleProps } from './role.props';

export type IRole = ITenantScopedEntity &
  RoleProps & {
    roleKind: RoleKind;
    required: boolean;
  };
