import { expirations } from '../../../config';
import { jwtAlgorithm, tokenSecrets } from '../../../config/secrets';
import { prisma } from '../../../database/prisma/db';

import { TokenType } from '@okampus/shared/enums';
import { objectContains } from '@okampus/shared/utils';

import { sign, verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

export enum JwtError {
  Expired = 'Expired',
  Invalid = 'Invalid',
  Outdated = 'Outdated',
}

const hasuraClaims = (sub: string, tenantScopeId: string) => ({
  'https://hasura.io/jwt/claims': {
    'x-hasura-allowed-roles': ['user'],
    'x-hasura-default-role': 'user',
    'x-hasura-user-id': sub,
    'x-hasura-tenant-id': tenantScopeId,
  },
});

export const verifyOptions = { issuer: 'okampus', algorithms: [jwtAlgorithm] };

type DecodeReturn = { error?: JwtError; sub?: string; fam?: string; tenantScope?: string };
export async function decodeAndVerifyJwtToken(token: string, type: TokenType): Promise<DecodeReturn> {
  let decoded;
  try {
    decoded = verify(token, tokenSecrets[type], verifyOptions);
    if (typeof decoded === 'string' || !decoded.sub || !decoded.fam) return { error: JwtError.Invalid };
    if (type === TokenType.Access) {
      const user = await prisma.user.findFirst({ where: { id: BigInt(decoded.sub) } });
      if (!user) return { error: JwtError.Outdated }; // User does not exist
      if (!objectContains(decoded, hasuraClaims(decoded.sub, user.originalTenantScopeId.toString())))
        return { error: JwtError.Outdated };
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) return { error: JwtError.Expired };
    if (error instanceof JsonWebTokenError) return { error: JwtError.Invalid };
    throw error;
  }

  return decoded;
}

export const signOptions = { issuer: 'okampus', algorithm: jwtAlgorithm };
export function createJwtToken(sub: string, tenantScopeId: string, type: TokenType, fam: string) {
  const claims = type === TokenType.Access ? hasuraClaims(sub, tenantScopeId) : {};
  const options = type === TokenType.Bot ? signOptions : { ...signOptions, expiresIn: expirations[type] };
  return sign({ sub, fam, tenantScope: tenantScopeId, ...claims }, tokenSecrets[type], options);
}