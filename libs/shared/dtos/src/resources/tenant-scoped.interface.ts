import { IBaseEntity } from './base.interface';
import { ITenantCore } from './org/tenant/tenant-core/tenant-core.interface';

export type ITenantScopedEntity = IBaseEntity & {
  tenant?: ITenantCore;
};
