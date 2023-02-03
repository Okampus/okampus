import { IBase } from './base.interface';
import { ITenantCore } from './org/tenant/tenant-core/tenant-core.interface';

export type ITenantScoped = IBase & {
  tenant?: ITenantCore;
};
