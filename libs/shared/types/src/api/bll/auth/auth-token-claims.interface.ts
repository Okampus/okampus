import type { RequestType, TokenType } from '@okampus/shared/enums';

export interface AuthClaims {
  iss?: string;
  sub: string;
  exp?: number;
  req?: RequestType; // Custom claim indicating the request type (Http or WebSocket)
  tok?: TokenType; // Custom claim indicating the token type (Access or Refresh)
  fam?: string; // Custom claim indicating the token family (Refresh)
}
