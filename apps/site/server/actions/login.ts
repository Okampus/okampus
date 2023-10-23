'use server';

import { wrapAction } from './utils/wrapAction';
import { accessCookieOptions, baseUrl, protocol, refreshCookieOptions } from '../../config';
import { passwordHashSecret } from '../../config/secrets';
import { prisma } from '../../database/prisma/db';
import { getNextLang } from '../ssr/getLang';
import { getTranslation } from '../ssr/getTranslation';
import { createSession } from '../trpc/auth/sessions';

import { COOKIE_NAMES, NEXT_PAGE_COOKIE } from '@okampus/shared/consts';
import { TokenType } from '@okampus/shared/enums';

import { verify } from 'argon2';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import type { NextFormMessages } from '../types';

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

export default wrapAction(async function login(
  _previous: NextFormMessages,
  formData: FormData,
): Promise<NextFormMessages> {
  const { t } = await getTranslation(getNextLang());

  const username = formData.get('username');
  if (!username || typeof username !== 'string')
    return { errors: { username: t('server-errors', 'MISSING_USERNAME') } };

  const password = formData.get('password');
  if (!password || typeof password !== 'string')
    return { errors: { password: t('server-errors', 'MISSING_PASSWORD') } };

  const user = await prisma.user.findFirst({
    where: { OR: [{ actor: { email: username } }, { slug: username }] },
    select: { id: true, passwordHash: true, originalTenantScope: { select: { id: true, domain: true } } },
  });
  if (!user) return { errors: { root: t('server-errors', 'INVALID_CREDENTIALS') } };
  if (!user.passwordHash) return { errors: { root: t('server-errors', 'NO_SET_PASSWORD') } };

  const isPasswordValid = await verify(user.passwordHash, password, { secret: passwordHashSecret });
  if (!isPasswordValid) return { errors: { root: t('server-errors', 'INVALID_CREDENTIALS') } };

  const { id } = user;

  const domain = formData.get('domain');

  const isDomain = domain && typeof domain === 'string';
  if (isDomain && !(await allowedTenant(domain, id)))
    return { errors: { root: t('server-errors', 'UNAUTHORIZED_TENANT') } };

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
