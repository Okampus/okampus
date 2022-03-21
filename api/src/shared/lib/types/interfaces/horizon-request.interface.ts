import type { User } from '../../../../users/user.entity';

export interface HorizonRequest {
  signedCookies: Record<string, string>;
  user: User;
}
