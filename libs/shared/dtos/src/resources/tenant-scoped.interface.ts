import type { IBase } from './base.interface';
import type { ITenantCore } from './org/tenant/tenant-core/tenant-core.interface';

export type ITenantScoped = IBase & {
  tenant?: ITenantCore;
};
