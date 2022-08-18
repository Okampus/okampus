import type { Strategy } from 'openid-client';
import type { User } from '../../../users/user.entity';

export class OIDCStrategyCache {
  strategies = new Map<string, Strategy<User>>();
}
