import type { RoleProps } from '@okampus/shared/dtos';
import type { TeamRoleKey } from '@okampus/shared/enums';
import type { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';

export type RoleOptions = RoleProps &
  TenantScopedOptions & {
    key?: TeamRoleKey | null;
    required?: boolean;
  };
