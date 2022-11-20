import type { Tenant } from '../../../../org/tenants/tenants/tenant.entity';

export interface TenantRequest {
  headers: Record<string, string>;
  tenant: Tenant;
}
