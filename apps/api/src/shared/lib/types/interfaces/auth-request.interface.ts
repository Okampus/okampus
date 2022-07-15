import type { User } from '../../../../users/user.entity';

export interface CookiesAuthRequest {
  signedCookies: Record<string, string>;
  user: User;
}

export interface HeaderAuthRequest {
  headers: Record<string, string>;
  user: User;
}
