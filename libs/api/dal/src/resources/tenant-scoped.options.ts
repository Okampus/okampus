import type { BaseOptions } from './base.options';
import type { Tenant } from '.';

export type TenantScopedOptions = BaseOptions & {
  tenant: Tenant;
};
