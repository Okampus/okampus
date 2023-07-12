import type { Individual } from '../../individual/individual.entity';
import type { Tenant } from '../tenant.entity';

export type AdminRoleOptions = {
  individual: Individual;
  tenant: Tenant | null;
  permissions: number[];
};
