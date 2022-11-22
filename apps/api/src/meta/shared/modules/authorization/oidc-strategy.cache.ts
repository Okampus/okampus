import type { Strategy } from 'openid-client';
import type { User } from '@modules/uua/users/user.entity';

export class OIDCStrategyCache {
  strategies = new Map<string, Strategy<User>>();
}
