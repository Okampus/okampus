import { AdminPermissions } from '@okampus/shared/enums';

type AdminRoleType = { permissions: number[]; tenant?: { id: string } | null };

export function canAdminDelete(role: AdminRoleType, entity: { tenantScope: { id: string } }) {
  return role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === entity.tenantScope.id;
}

export function canAdminManage(role: AdminRoleType, entity: { tenantScope: { id: string } }) {
  return role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === entity.tenantScope.id;
}
