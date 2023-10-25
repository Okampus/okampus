'use server';

import { decodeAndVerifyJwtToken, JwtError } from '../../trpc/auth/jwt';
import { getAccessSession, getRefreshSession, refreshSession } from '../../trpc/auth/sessions';

import { accessCookieOptions, refreshCookieOptions } from '../../../config';
import { prisma } from '../../../database/prisma/db';

import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../../error';
import { TokenType } from '@okampus/shared/enums';
import { COOKIE_NAMES } from '@okampus/shared/consts';

import { headers as getHeaders, cookies as getCookies } from 'next/headers';

import type { Prisma } from '@prisma/client';

export type AuthPayload = { userId: bigint; role: 'user' | 'admin' };
async function ensureTokenAndGetPayload(token: string, tokenType: TokenType, headers: Headers): Promise<AuthPayload> {
  const cookies = getCookies();
  const { error, sub, fam, role } = await decodeAndVerifyJwtToken(token, tokenType);

  if (error === JwtError.Invalid) {
    throw new UnauthorizedError(`INVALID_${tokenType}_TOKEN`);
  } else if (error === JwtError.Outdated) {
    throw new UnauthorizedError(`EXPIRED_${tokenType}_TOKEN`);
  } else if (!error && sub && fam && role) {
    const session =
      tokenType === TokenType.Refresh
        ? await getRefreshSession(headers, sub, fam, token)
        : await getAccessSession(headers, sub, fam);

    if (!session) throw new UnauthorizedError('COMPROMISED_SESSION');

    if (tokenType === TokenType.Refresh) {
      const { accessToken, refreshToken } = await refreshSession(session.id, sub, fam);
      cookies.set(COOKIE_NAMES[TokenType.Access], accessToken, accessCookieOptions);
      cookies.set(COOKIE_NAMES[TokenType.Refresh], refreshToken, refreshCookieOptions);
    }

    await prisma.session.update({ where: { id: session.id }, data: { lastActivityAt: new Date() } });
    return { userId: BigInt(sub), role };
  } else {
    throw new UnauthorizedError(`INVALID_${tokenType}_TOKEN`);
  }
}

export type AuthContext = AuthPayload & { tenant: { id: bigint; actorId: bigint; domain: string } };
export type AuthContextMaybeUser = Omit<AuthContext, 'userId'> & { userId?: bigint };
export async function ensureAuthContext(): Promise<AuthContext> {
  const headers = getHeaders();

  const origin = headers.get('origin');
  if (!origin) throw new BadRequestError('MISSING_HEADER', { header: 'Origin' });

  const domain = origin.split('//')[1].split('.')[0];
  if (!domain) throw new BadRequestError('INVALID_HEADER', { header: 'Origin' });

  const tenant = await prisma.tenant.findUnique({ where: { domain }, select: { id: true, actorId: true } });
  if (!tenant) throw new NotFoundError('NOT_FOUND_TENANT', { domain });

  const authorization = headers.get('authorization');
  if (authorization) {
    const [bearer, jwt] = authorization.split(' ');
    if (bearer === 'Bearer' && jwt) {
      const botPayload = await ensureTokenAndGetPayload(jwt, TokenType.Bot, headers);
      return { ...botPayload, tenant: { ...tenant, domain } };
    }
  }

  const cookies = getCookies();
  const accessCookie = cookies.get(COOKIE_NAMES[TokenType.Access])?.value;
  const refreshCookie = cookies.get(COOKIE_NAMES[TokenType.Refresh])?.value;

  if (accessCookie) {
    const accessPayload = await ensureTokenAndGetPayload(accessCookie, TokenType.Access, headers);
    return { ...accessPayload, tenant: { ...tenant, domain } };
  }

  if (refreshCookie) {
    const refreshPayload = await ensureTokenAndGetPayload(refreshCookie, TokenType.Refresh, headers);
    return { ...refreshPayload, tenant: { ...tenant, domain } };
  }

  throw new UnauthorizedError('MISSING_TOKEN');
}

type WithAuth = AuthContext & { tenantMemberId: bigint | null };
type WithAuthOptions = { tenantRole?: Prisma.TenantRoleWhereInput };
export async function withAuth(options?: WithAuthOptions): Promise<WithAuth> {
  const tenantRole = options?.tenantRole;
  const authContext = await ensureAuthContext();

  const tenantMember = await prisma.tenantMember.findFirst({
    where: {
      tenantScopeId: authContext.tenant.id,
      userId: authContext.userId,
      ...(tenantRole && {
        tenantMemberRoles: { some: { tenantRole } },
      }),
    },
  });

  if (!tenantMember && authContext.role !== 'admin')
    throw new ForbiddenError('UNAUTHORIZED_TENANT', { domain: authContext.tenant.domain });

  return { ...authContext, tenantMemberId: tenantMember?.id ?? null };
}
