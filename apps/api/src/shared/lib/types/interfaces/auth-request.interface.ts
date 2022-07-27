import type { IncomingMessage } from 'node:http';
import type { User } from '../../../../users/user.entity';

export interface CookiesAuthRequest extends IncomingMessage {
  signedCookies: Record<string, string>;
  user: User;
}

export interface HeaderAuthRequest {
  headers: Record<string, string>;
  user: User;
}
