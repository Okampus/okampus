import type { User } from '../../../../users/user.entity';

export interface AuthRequest {
  signedCookies: Record<string, string>;
  user: User;
}
