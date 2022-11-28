import type { UserinfoResponse } from 'openid-client';


export interface TenantUserinfoResponse extends UserinfoResponse {
  role: string;
}
