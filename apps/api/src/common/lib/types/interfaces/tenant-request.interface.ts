import type { Tenant } from '@modules/org/tenants/tenant.entity';

export interface TenantRequest {
  headers: Record<string, string>;
  tenant: Tenant;
}
