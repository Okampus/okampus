'use server';

import { wrapAction } from './utils/wrapAction';
import { accessCookieOptions, baseUrl, protocol, refreshCookieOptions } from '../../config';
import { passwordHashSecret } from '../../config/secrets';
import prisma from '../../database/prisma/db';
import { createSession } from '../trpc/auth/sessions';

import { BadRequestError, ForbiddenError, UnauthorizedError } from '../error';
import { COOKIE_NAMES, NEXT_PAGE_COOKIE } from '@okampus/shared/consts';
import { TokenType } from '@okampus/shared/enums';

import { verify } from 'argon2';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import type { FormMessages } from '../types';

const nextUrl = (url: string, domain: string) => {
  url = url === '/signin' ? '/' : url;
  return `${protocol}://${domain}.${baseUrl}${url}`;
};

async function allowedTenant(domain: string, userId: bigint) {
  const tenantMember = await prisma.tenantMember.findFirst({
    where: { userId, tenantScope: { domain }, deletedAt: null },
    select: { tenantScopeId: true },
  });
  if (tenantMember) return true;

  const adminRole = await prisma.adminRole.findFirst({
    select: { tenantId: true },
    where: { OR: [{ tenant: { domain } }, { tenant: null }], userId },
  });
  if (adminRole?.tenantId) return true;
  if (adminRole) {
    const tenant = await prisma.tenant.findFirst({ where: { domain } });
    if (tenant) return true;
  }

  return false;
}

export default wrapAction(async function login(_previous: FormMessages, formData: FormData) {
  const username = formData.get('username');
  if (!username || typeof username !== 'string') throw new BadRequestError('INVALID_FIELD', { field: 'username' });

  const password = formData.get('password');
  if (!password || typeof password !== 'string') throw new BadRequestError('INVALID_FIELD', { field: 'password' });

  type UserPassword = { id: bigint; passwordHash: string }[];
  const rows =
    await prisma.$queryRaw<UserPassword>`SELECT "user"."id", "user"."passwordHash" FROM "user" INNER JOIN "actor" ON "user"."actorId" = "actor"."id" WHERE "user"."slug" = ${username} OR "actor"."email" = ${username}`;

  const user = rows.at(0);
  if (!user) throw new UnauthorizedError('INVALID_CREDENTIALS');
  if (!user.passwordHash) throw new UnauthorizedError('INVALID_AUTH_METHOD');

  const isPasswordValid = await verify(user.passwordHash, password, { secret: passwordHashSecret });
  if (!isPasswordValid) throw new UnauthorizedError('INVALID_CREDENTIALS');

  const { id } = user;
  const domain = formData.get('domain');

  const isDomain = domain && typeof domain === 'string';
  if (isDomain && !(await allowedTenant(domain, id))) throw new ForbiddenError('UNAUTHORIZED_TENANT');

  const { accessToken, refreshToken } = await createSession(headers(), id.toString());

  cookies().set(COOKIE_NAMES[TokenType.Access], accessToken, accessCookieOptions);
  cookies().set(COOKIE_NAMES[TokenType.Refresh], refreshToken, refreshCookieOptions);

  if (isDomain) {
    const next = cookies().get(NEXT_PAGE_COOKIE)?.value || '/';
    redirect(nextUrl(next, domain));
  } else {
    redirect('/signin/tenant');
  }
});
