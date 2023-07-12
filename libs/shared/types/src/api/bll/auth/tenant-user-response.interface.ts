import type { UserinfoResponse } from 'openid-client';

export interface TenantUserResponse extends UserinfoResponse {
  sub: string;
  given_name: string;
  family_name: string;
  email: string;
  role: string;
}
