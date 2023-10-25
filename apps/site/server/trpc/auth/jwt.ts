import { expirations, issuer } from '../../../config';
import { jwtAlgorithm, tokenSecrets } from '../../../config/secrets';
import prisma from '../../../database/prisma/db';

import { TokenType } from '@okampus/shared/enums';
import { objectContains } from '@okampus/shared/utils';

import * as jose from 'jose';

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

export const verifyOptions = { issuer, keyManagementAlgorithms: [jwtAlgorithm] };

type DecodeReturn = { error?: JwtError; sub?: string; fam?: string; role?: 'user' | 'admin' };
export async function decodeAndVerifyJwtToken(token: string, type: TokenType): Promise<DecodeReturn> {
  let decoded, isAdmin;
  try {
    decoded = await jose.jwtDecrypt(token, tokenSecrets[type], verifyOptions);
    if (
      typeof decoded === 'string' ||
      !decoded.payload.sub ||
      !decoded.payload.fam ||
      typeof decoded.payload.fam !== 'string'
    )
      return { error: JwtError.Invalid };

    const user = await prisma.user.findFirst({
      where: { id: BigInt(decoded.payload.sub), deletedAt: null },
      include: { _count: { select: { adminRoles: { where: { deletedAt: null } } } } },
    });

    if (!user) return { error: JwtError.Outdated }; // User does not exist

    isAdmin = user._count.adminRoles > 0;
    if (type === TokenType.Access && !objectContains(decoded, hasuraClaims({ sub: decoded.payload.sub, isAdmin })))
      return { error: JwtError.Outdated };
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) return { error: JwtError.Expired };
    if (error instanceof jose.errors.JWTInvalid) return { error: JwtError.Invalid };
    return { error: JwtError.Unexpected };
  }

  return { sub: decoded.payload.sub, fam: decoded.payload.fam, role: isAdmin ? 'admin' : 'user' };
}

export async function createJwtToken(sub: string, fam: string, type: TokenType, isAdmin?: boolean) {
  const claims = type === TokenType.Access ? hasuraClaims({ sub, isAdmin }) : {};
  const jwt = new jose.SignJWT({ sub, fam, ...claims })
    .setIssuedAt()
    .setIssuer(issuer)
    .setProtectedHeader({ alg: jwtAlgorithm });

  if (type !== TokenType.Bot) jwt.setExpirationTime(`${expirations[type]}s`);
  return await jwt.sign(tokenSecrets[type]);
}
