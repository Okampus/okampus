const CREATE_TENANT = 1;
const MANAGE_TENANT_ENTITIES = 2;
const DELETE_TENANT_ENTITIES = 4;

export enum AdminPermissions {
  CreateTenant = CREATE_TENANT,
  ManageTenantEntities = MANAGE_TENANT_ENTITIES,
  DeleteTenantEntities = DELETE_TENANT_ENTITIES,
}
