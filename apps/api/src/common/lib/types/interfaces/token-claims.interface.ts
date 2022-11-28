import type { RequestType } from '../enums/request-type.enum';

export interface TokenClaims {
  iss: string;
  sub: string;
  exp: number;
  requestType: RequestType;
}
