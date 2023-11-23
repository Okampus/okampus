'use server';

import { createSession } from '../auth/sessions';
import { ForbiddenError, UnauthorizedError } from '../error';
import { passwordHashSecret } from '../secrets';

import { accessCookieOptions, baseUrl, protocol, refreshCookieOptions } from '../../config';

import prisma from '../../database/prisma/db';

import { signinSchema } from '../../schemas/signin';

import { getDomainFromHostname } from '../../utils/get-domain-from-hostname';
import { withErrorHandling } from '../utils/withErrorHandling';
import { withZod } from '../utils/withZod';

import { COOKIE_NAMES } from '@okampus/shared/consts';
import { TokenType } from '@okampus/shared/enums';

import { verify } from 'argon2';
import { cookies, headers as getHeaders } from 'next/headers';
import { redirect } from 'next/navigation';

import path from 'node:path';

const nextUrl = (domain: string, url?: string) => {
  url = url === '/signin' ? '/' : url ?? '/';
  const base = `${domain}.${baseUrl}`;
  return `${protocol}://${path.join(base, url)}`;
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

export default withErrorHandling(async function signin(formData: FormData) {
  const { next, username, password } = await withZod({ formData, zodSchema: signinSchema });

  type UserPassword = { id: bigint; passwordHash: string }[];
  const rows =
    await prisma.$queryRaw<UserPassword>`SELECT "user"."id", "user"."passwordHash" FROM "user" INNER JOIN "actor" ON "user"."actorId" = "actor"."id" WHERE "user"."slug" = ${username} OR "actor"."email" = ${username}`;

  const user = rows.at(0);
  if (!user) throw new UnauthorizedError('INVALID_CREDENTIALS');
  if (!user.passwordHash) throw new UnauthorizedError('INVALID_AUTH_METHOD');

  const isPasswordValid = await verify(user.passwordHash, password, { secret: passwordHashSecret });
  if (!isPasswordValid) throw new UnauthorizedError('INVALID_CREDENTIALS');

  const { id } = user;

  const headers = getHeaders();
  const domain = getDomainFromHostname(headers.get('host') || headers.get('origin') || headers.get('referer') || '');
  if (!domain) throw new ForbiddenError('UNAUTHORIZED_TENANT');
  if (domain && !(await allowedTenant(domain, id))) throw new ForbiddenError('UNAUTHORIZED_TENANT');
  const { accessToken, refreshToken } = await createSession(headers, id.toString());

  cookies().set(COOKIE_NAMES[TokenType.Access], accessToken, accessCookieOptions);
  cookies().set(COOKIE_NAMES[TokenType.Refresh], refreshToken, refreshCookieOptions);

  console.log({ url: nextUrl(domain, next) });
  redirect(nextUrl(domain, next));
});
