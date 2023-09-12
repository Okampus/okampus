import type { RequestType, TokenType } from '@okampus/shared/enums';

export interface AuthClaims {
  iss?: string;
  sub: string;
  exp?: number;
  req?: RequestType; // Custom claim indicating the request type (Http or WebSocket)
  tok?: TokenType; // Custom claim indicating the token type (Access or Refresh)
  fam?: string; // Custom claim indicating the token family (Refresh)
  'https://hasura.io/jwt/claims'?: {
    'x-hasura-allowed-roles': string[];
    'x-hasura-default-role': string;
    'x-hasura-user-id': string;
  };
}
