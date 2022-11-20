import type { IncomingMessage } from 'node:http';
import type { Tenant } from '../../../../org/tenants/tenants/tenant.entity';
import type { User } from '../../../../uua/users/user.entity';

export interface AuthRequest extends IncomingMessage {
  signedCookies: Record<string, string>;
  user: User;
  tenant: Tenant;
}
