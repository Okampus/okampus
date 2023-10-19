'use server';

import { accessCookieOptions, refreshCookieOptions } from '../../config';
import { prisma } from '../../database/prisma/db';
import { decodeAndVerifyJwtToken, JwtError } from '../trpc/auth/jwt';
import { getAccessSession, getRefreshSession, refreshSession } from '../trpc/auth/sessions';

import { getTranslation } from '../ssr/getTranslation';
import { getNextLang } from '../ssr/getLang';

import { COOKIE_NAMES } from '@okampus/shared/consts';
import { TokenType } from '@okampus/shared/enums';

import { headers as getHeaders, cookies as getCookies } from 'next/headers';
import type { NextFormMessages } from '../../app/_forms/NextForm/NextForm';

export async function getAuthContext(): Promise<NextFormMessages | { userId: bigint }> {
  const { t } = await getTranslation(getNextLang());
  try {
    const headers = getHeaders();

    const authorization = headers.get('authorization');
    if (authorization) {
      // Assume bot authentication
      const [bearer, jwt] = authorization.split(' ');
      if (bearer === 'Bearer' && jwt) {
        const { error, sub, fam } = await decodeAndVerifyJwtToken(jwt, TokenType.Bot);
        if (error || !sub || !fam) throw new Error('Missing bot token.'); // TODO: trigger alert

        const session = await getAccessSession(headers, sub, fam);
        if (session) {
          await prisma.session.update({ where: { id: session.id }, data: { lastActivityAt: new Date() } });
          return { userId: BigInt(sub) };
        }

        return { errors: { root: t('server-errors', 'invalid_bot_token') } };
      }
    }

    const cookies = getCookies();
    const accessCookie = cookies.get(COOKIE_NAMES[TokenType.Access])?.value;
    const refreshCookie = cookies.get(COOKIE_NAMES[TokenType.Refresh])?.value;

    if (accessCookie) {
      const { error, sub, fam } = await decodeAndVerifyJwtToken(accessCookie, TokenType.Access);
      // TODO: trigger alert (& revoke?)
      if (error === JwtError.Invalid) return { errors: { root: t('server-errors', 'invalid_access_token') } };
      else if (!error && sub && fam) {
        const session = await getAccessSession(headers, sub, fam);
        if (session) {
          await prisma.session.update({ where: { id: session.id }, data: { lastActivityAt: new Date() } });
          return { userId: BigInt(sub) };
        }
      }
    }

    if (refreshCookie) {
      const { error, sub, fam } = await decodeAndVerifyJwtToken(refreshCookie, TokenType.Refresh);
      // TODO: trigger alert (& revoke?)
      if (error === JwtError.Invalid) return { errors: { root: t('server-errors', 'invalid_refresh_token') } };
      if (error === JwtError.Outdated) return { errors: { root: t('server-errors', 'expired_refresh_token') } };
      else if (!error && sub && fam) {
        const session = await getRefreshSession(headers, sub, fam, refreshCookie);
        // TODO: raise alert
        if (!session) return { errors: { root: t('server-errors', 'compromised_session') } };

        // Refresh session
        const { accessToken, refreshToken } = await refreshSession(session.id, sub, fam);

        cookies.set(COOKIE_NAMES[TokenType.Access], accessToken, accessCookieOptions);
        cookies.set(COOKIE_NAMES[TokenType.Refresh], refreshToken, refreshCookieOptions);

        return { userId: BigInt(sub) };
      }
    }
  } catch {
    return {};
  }

  return {};
}
