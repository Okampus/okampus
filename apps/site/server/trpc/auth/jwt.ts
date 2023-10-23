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
  Unexpected = 'Unexpected',
}

const hasuraClaims = ({ sub, isAdmin }: { sub: string; isAdmin?: boolean }) => ({
  'https://hasura.io/jwt/claims': {
    'x-hasura-allowed-roles': [isAdmin ? 'admin' : 'user'],
    'x-hasura-default-role': isAdmin ? 'admin' : 'user',
    'x-hasura-user-id': sub,
  },
});

export const verifyOptions = { issuer: 'okampus', algorithms: [jwtAlgorithm] };

type DecodeReturn = { error?: JwtError; sub?: string; fam?: string; role?: 'user' | 'admin' };
export async function decodeAndVerifyJwtToken(token: string, type: TokenType): Promise<DecodeReturn> {
  let decoded, isAdmin;
  try {
    decoded = verify(token, tokenSecrets[type], verifyOptions);
    if (typeof decoded === 'string' || !decoded.sub || !decoded.fam) return { error: JwtError.Invalid };

    const user = await prisma.user.findFirst({
      where: { id: BigInt(decoded.sub), deletedAt: null },
      include: { _count: { select: { adminRoles: { where: { deletedAt: null } } } } },
    });

    if (!user) return { error: JwtError.Outdated }; // User does not exist

    isAdmin = user._count.adminRoles > 0;
    if (type === TokenType.Access && !objectContains(decoded, hasuraClaims({ sub: decoded.sub, isAdmin })))
      return { error: JwtError.Outdated };
  } catch (error) {
    if (error instanceof TokenExpiredError) return { error: JwtError.Expired };
    if (error instanceof JsonWebTokenError) return { error: JwtError.Invalid };
    return { error: JwtError.Unexpected };
  }

  return { sub: decoded.sub, fam: decoded.fam, role: isAdmin ? 'admin' : 'user' };
}

export const signOptions = { issuer: 'okampus', algorithm: jwtAlgorithm };

export function createJwtToken(sub: string, fam: string, type: TokenType, isAdmin?: boolean) {
  const claims = type === TokenType.Access ? hasuraClaims({ sub, isAdmin }) : {};
  const options = type === TokenType.Bot ? signOptions : { ...signOptions, expiresIn: expirations[type] };
  return sign({ sub, fam, ...claims }, tokenSecrets[type], options);
}
