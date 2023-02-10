import type { Snowflake } from '../../../snowflake';
import type { RequestType, TokenType } from '@okampus/shared/enums';

export interface AuthTokenClaims {
  iss?: string;
  sub: Snowflake;
  exp?: number;
  req?: RequestType; // Custom claim indicating the request type (Http or WebSocket)
  tok?: TokenType; // Custom claim indicating the token type (Access or Refresh)
  fam?: string; // Custom claim indicating the token family (Refresh)
}
