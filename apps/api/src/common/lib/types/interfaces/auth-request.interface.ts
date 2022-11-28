import type { IncomingMessage } from 'node:http';
import type { Tenant } from '@modules/org/tenants/tenant.entity';
import type { User } from '@modules/uaa/users/user.entity';

export interface AuthRequest extends IncomingMessage {
  signedCookies: Record<string, string>;
  user: User;
  tenant: Tenant;
}
