import type { User } from '../../user/user.entity';
import type { Tenant } from '../tenant.entity';

export type AdminRoleOptions = {
  user: User;
  tenant: Tenant | null;
  permissions: number[];
};
