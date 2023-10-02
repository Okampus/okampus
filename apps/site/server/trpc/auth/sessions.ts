import { createJwtToken } from './jwt';
import { refreshHashSecret } from '../../../config/secrets';
import { prisma } from '../../../database/prisma/db';

import { TokenType } from '@okampus/shared/enums';
import { randomId } from '@okampus/shared/utils';

import { hash, verify } from 'argon2';
import DeviceDetector from 'device-detector-js';

const deviceDetector = new DeviceDetector();
export async function getAccessSession(req: Request, sub: string, fam: string) {
  const device: object = deviceDetector.parse(req.headers.get('user-agent') ?? '');
  const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'Unknown';
  const country = req.headers.get('cf-ipcountry') ?? req.headers.get('x-country-code') ?? 'ZZ';

  const tokenWhere = { userId: BigInt(sub), tokenFamily: fam, expiredAt: null, revokedAt: null };

  const sureSession = await prisma.session.findFirst({
    where: { ...tokenWhere, device: { equals: device }, ip, country },
  });

  if (sureSession) return sureSession;

  const unsureSession = await prisma.session.findFirst({ where: tokenWhere });
  if (unsureSession) return unsureSession; // TODO: trigger alert "suspicious : a token was used on a new device"
  // TODO: trigger alert "suspicious : a revoked token was used"
  return null;
}

export async function getRefreshSession(req: Request, sub: string, fam: string, token: string) {
  const session = await getAccessSession(req, sub, fam);
  if (!session) return null;

  if (!(await verify(session.refreshTokenHash, token, { secret: refreshHashSecret }))) {
    // TODO: trigger alert: "suspicious : an expired refresh token of the same family was used"
    // Revoke
    await prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
    return null;
  }

  return session;
}

export async function createSession(req: Request, sub: string) {
  const device: object = deviceDetector.parse(req.headers.get('user-agent') ?? '');
  const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'Unknown';
  const country = req.headers.get('cf-ipcountry') ?? req.headers.get('x-country-code') ?? 'ZZ';

  const fam = randomId();

  const accessToken = createJwtToken(sub, TokenType.Access, fam);
  const refreshToken = createJwtToken(sub, TokenType.Refresh, fam);

  const refreshTokenHash = await hash(refreshToken, { secret: refreshHashSecret });

  await prisma.session.create({
    data: {
      country,
      device,
      ip,
      lastActivityAt: new Date(),
      lastIssuedAt: new Date(),
      refreshTokenHash,
      tokenFamily: fam,
      userId: BigInt(sub),
    },
  });

  return { accessToken, refreshToken };
}

export async function refreshSession(sessionId: bigint, sub: string, fam: string) {
  const accessToken = createJwtToken(sub, TokenType.Access, fam);
  const refreshToken = createJwtToken(sub, TokenType.Refresh, fam);

  const refreshTokenHash = await hash(refreshToken, { secret: refreshHashSecret });

  await prisma.session.update({
    where: { id: sessionId },
    data: { lastActivityAt: new Date(), lastIssuedAt: new Date(), refreshTokenHash },
  });

  return { accessToken, refreshToken };
}
