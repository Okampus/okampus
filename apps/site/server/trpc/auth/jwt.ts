import { expirations } from '../../../config';
import { jwtAlgorithm, tokenSecrets } from '../../../config/secrets';

import { TokenType } from '@okampus/shared/enums';
import { objectContains } from '@okampus/shared/utils';

import { sign, verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

export enum JwtError {
  Expired = 'Expired',
  Invalid = 'Invalid',
  Outdated = 'Outdated',
}

const hasuraClaims = (sub: string) => ({
  'https://hasura.io/jwt/claims': {
    'x-hasura-allowed-roles': ['user'],
    'x-hasura-default-role': 'user',
    'x-hasura-user-id': sub,
  },
});

export const verifyOptions = { issuer: 'okampus', algorithms: [jwtAlgorithm] };

type DecodeReturn = { error?: JwtError; sub?: string; fam?: string };
export function decodeAndVerifyJwtToken(token: string, type: TokenType): DecodeReturn {
  let decoded;
  try {
    decoded = verify(token, tokenSecrets[type], verifyOptions);
    if (typeof decoded === 'string' || !decoded.sub || !decoded.fam) return { error: JwtError.Invalid };
    if (type === TokenType.Access && !objectContains(decoded, hasuraClaims(decoded.sub)))
      return { error: JwtError.Outdated };
  } catch (error) {
    if (error instanceof TokenExpiredError) return { error: JwtError.Expired };
    if (error instanceof JsonWebTokenError) return { error: JwtError.Invalid };
    throw error;
  }

  return decoded;
}

export const signOptions = { issuer: 'okampus', algorithm: jwtAlgorithm };
export function createJwtToken(sub: string, type: TokenType, fam: string) {
  const claims = type === TokenType.Access ? hasuraClaims(sub) : {};
  const options = type === TokenType.Bot ? signOptions : { ...signOptions, expiresIn: expirations[type] };
  return sign({ sub, fam, ...claims }, tokenSecrets[type], options);
}
