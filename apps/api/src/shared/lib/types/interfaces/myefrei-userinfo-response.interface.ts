import type { UserinfoResponse } from 'openid-client';

export interface MyEfreiUserinfoResponse extends UserinfoResponse {
  role: string;
}
