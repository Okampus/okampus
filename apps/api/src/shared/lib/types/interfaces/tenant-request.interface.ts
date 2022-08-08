import type { Tenant } from '../../../../tenants/tenants/tenant.entity';

export interface TenantRequest {
  headers: Record<string, string>;
  tenant: Tenant;
}
