import type { User } from '../../user/user.entity';

export type AdminRoleOptions = {
  user: User;
  canCreateTenant?: boolean;
  canManageTenantEntities?: boolean;
  canDeleteTenantEntities?: boolean;
};
