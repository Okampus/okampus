import type { RequestType } from '../enums/request-type.enum';

export interface TokenClaims {
  sub: string;
  requestType: RequestType;
}
