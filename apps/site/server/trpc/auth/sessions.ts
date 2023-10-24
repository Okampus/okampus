import { createJwtToken } from './jwt';
import { refreshHashSecret } from '../../../config/secrets';
import { prisma } from '../../../database/prisma/db';

import { TokenType } from '@okampus/shared/enums';
import { enumChecker, randomId } from '@okampus/shared/utils';

import { CountryCode } from '@prisma/client';

import { hash, verify } from 'argon2';
import DeviceDetector from 'device-detector-js';

import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

const isCountryCode = enumChecker(CountryCode);

function getContext(headers: ReadonlyHeaders) {
  const device: object = deviceDetector.parse(headers.get('user-agent') ?? '');
  const ip = headers.get('cf-connecting-ip') ?? headers.get('x-forwarded-for') ?? 'Unknown';
  const country = headers.get('cf-ipcountry') ?? headers.get('x-country-code') ?? 'XX';
  return { country: isCountryCode(country) ? country : CountryCode.XX, device, ip };
}

const deviceDetector = new DeviceDetector();
export async function getAccessSession(headers: ReadonlyHeaders, sub: string, fam: string) {
  const { device, ip, country } = getContext(headers);
  const tokenWhere = { userId: BigInt(sub), tokenFamily: fam, expiredAt: null, deletedAt: null };

  const sureSession = await prisma.session.findFirst({
    where: { ...tokenWhere, device: { equals: device }, ip, country },
  });

  if (sureSession) return sureSession;

  const unsureSession = await prisma.session.findFirst({ where: tokenWhere });
  if (unsureSession) return unsureSession; // TODO: trigger alert "suspicious : a token was used on a new device"
  // TODO: trigger alert "suspicious : a revoked token was used"
  return null;
}

export async function getRefreshSession(headers: ReadonlyHeaders, sub: string, fam: string, token: string) {
  const session = await getAccessSession(headers, sub, fam);
  if (!session) return null;

  if (!(await verify(session.refreshTokenHash, token, { secret: refreshHashSecret }))) {
    // TODO: trigger alert: "suspicious : an expired refresh token of the same family was used"
    // Revoke
    await prisma.session.update({ where: { id: session.id }, data: { deletedAt: new Date() } });
    return null;
  }

  return session;
}

export async function createSession(headers: Headers, sub: string) {
  const { device, ip, country } = getContext(headers);
  const fam = randomId();

  const isAdmin = (await prisma.adminRole.count({ where: { userId: BigInt(sub), deletedAt: null } })) > 0;
  const [accessToken, refreshToken] = await Promise.all([
    createJwtToken(sub, fam, TokenType.Access, isAdmin),
    createJwtToken(sub, fam, TokenType.Refresh, isAdmin),
  ]);

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
  const isAdmin = (await prisma.adminRole.count({ where: { userId: BigInt(sub), deletedAt: null } })) > 0;
  const [accessToken, refreshToken] = await Promise.all([
    createJwtToken(sub, fam, TokenType.Access, isAdmin),
    createJwtToken(sub, fam, TokenType.Refresh, isAdmin),
  ]);
  const refreshTokenHash = await hash(refreshToken, { secret: refreshHashSecret });

  await prisma.session.update({
    where: { id: sessionId },
    data: { lastActivityAt: new Date(), lastIssuedAt: new Date(), refreshTokenHash },
  });

  return { accessToken, refreshToken };
}
