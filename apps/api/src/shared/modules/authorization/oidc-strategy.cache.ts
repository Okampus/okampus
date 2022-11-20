import type { Strategy } from 'openid-client';
import type { User } from '../../../uua/users/user.entity';

export class OIDCStrategyCache {
  strategies = new Map<string, Strategy<User>>();
}
