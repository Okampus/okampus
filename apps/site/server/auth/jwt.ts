import { expirations, issuer } from '../../config';
import { jwtAlgorithm, tokenSecrets } from '../secrets';
import prisma from '../../database/prisma/db';

import { TokenType } from '@okampus/shared/enums';

import * as jose from 'jose';

export enum JwtError {
  Expired = 'Expired',
  Invalid = 'Invalid',
  Outdated = 'Outdated',
  Unexpected = 'Unexpected',
}

export const verifyOptions = { issuer, keyManagementAlgorithms: [jwtAlgorithm] };

type DecodeReturn = { error?: JwtError; sub?: string; fam?: string; role?: 'user' | 'admin' };
export async function decodeAndVerifyJwtToken(token: string, type: TokenType): Promise<DecodeReturn> {
  let decoded, isAdmin;
  try {
    decoded = await jose.jwtVerify(token, tokenSecrets[type], verifyOptions);
    if (!decoded.payload.sub || !decoded.payload.fam || typeof decoded.payload.fam !== 'string')
      return { error: JwtError.Invalid };

    const user = await prisma.user.findFirst({
      where: { id: BigInt(decoded.payload.sub) },
      select: { _count: { select: { adminRoles: { where: { deletedAt: null } } } } },
    });

    if (!user) return { error: JwtError.Outdated }; // User does not exist

    isAdmin = user._count.adminRoles > 0;
    if ((isAdmin && decoded.payload.role !== 'admin') || (!isAdmin && decoded.payload.role !== 'user'))
      return { error: JwtError.Invalid };
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) return { error: JwtError.Expired };
    if (error instanceof jose.errors.JWTInvalid) return { error: JwtError.Invalid };
    return { error: JwtError.Unexpected };
  }

  return decoded.payload;
}

export async function createJwtToken(sub: string, fam: string, type: TokenType, role: 'admin' | 'user') {
  const jwt = new jose.SignJWT({ sub, fam, role })
    .setIssuedAt()
    .setIssuer(issuer)
    .setProtectedHeader({ alg: jwtAlgorithm });

  if (type !== TokenType.Bot) jwt.setExpirationTime(`${expirations[type]}s`);
  return await jwt.sign(tokenSecrets[type]);
}
