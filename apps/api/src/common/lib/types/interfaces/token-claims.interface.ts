import type { RequestType } from '@lib/types/enums/request-type.enum';

export interface TokenClaims {
  iss: string;
  sub: string;
  exp: number;
  requestType: RequestType;
}
