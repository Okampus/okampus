import { AdminPermissions } from '@okampus/shared/enums';

type AdminRoleType = { permissions: number[]; tenant?: { id: string } | null };

export function canAdminDelete(role: AdminRoleType, entity: { tenant: { id: string } }) {
  return role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === entity.tenant.id;
}

export function canAdminUpdate(role: AdminRoleType, entity: { tenant: { id: string } }) {
  return role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === entity.tenant.id;
}

export function canAdminCreate(role: AdminRoleType, tenant: { id: string }) {
  return role.permissions.includes(AdminPermissions.CreateTenant) && role.tenant?.id === tenant.id;
}