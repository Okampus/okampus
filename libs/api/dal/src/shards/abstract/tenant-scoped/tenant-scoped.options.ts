import type { Individual } from '../../../resources/actor/individual/individual.entity';
import type { TenantCore } from '../../../resources/org/tenant/tenant-core.entity';

export type TenantScopedOptions = {
  tenant: TenantCore;
  createdBy: Individual | null;
};
