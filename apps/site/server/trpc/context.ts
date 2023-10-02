import { JwtError, decodeAndVerifyJwtToken } from './auth/jwt';
import { getAccessSession, getRefreshSession, refreshSession } from './auth/sessions';
import { accessCookieOptions, refreshCookieOptions } from '../../config';
import { prisma } from '../../database/prisma/db';

import { COOKIE_NAMES } from '@okampus/shared/consts';
import { TokenType } from '@okampus/shared/enums';
import { getSetCookieString, parseCookieHeader } from '@okampus/shared/utils';

import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import type { CookieOptions } from '@okampus/shared/types';

type SetCookie = (name: string, value: string, options: CookieOptions) => void;

async function getAuthContext(req: Request, setCookie: SetCookie) {
  try {
    const authorization = req.headers.get('authorization');
    if (authorization) {
      // Assume bot authentication
      const [bearer, jwt] = authorization.split(' ');
      if (bearer === 'Bearer' && jwt) {
        const { error, sub, fam } = decodeAndVerifyJwtToken(jwt, TokenType.Bot);
        if (error || !sub || !fam) throw new Error('Missing bot token.'); // TODO: trigger alert

        const session = await getAccessSession(req, sub, fam);
        if (session) {
          await prisma.session.update({ where: { id: session.id }, data: { lastActivityAt: new Date() } });
          return { userId: BigInt(sub) };
        }

        return {};
      }
    }

    const cookies = parseCookieHeader(req.headers.get('cookie') ?? '');
    const accessCookie = cookies?.[COOKIE_NAMES[TokenType.Access]];
    const refreshCookie = cookies?.[COOKIE_NAMES[TokenType.Refresh]];

    if (accessCookie) {
      const { error, sub, fam } = decodeAndVerifyJwtToken(accessCookie, TokenType.Access);
      // TODO: trigger alert (& revoke?)
      if (error === JwtError.Invalid) return {};
      else if (!error && sub && fam) {
        const session = await getAccessSession(req, sub, fam);
        if (session) {
          await prisma.session.update({ where: { id: session.id }, data: { lastActivityAt: new Date() } });
          return { userId: BigInt(sub) };
        }
      }
    }

    if (refreshCookie) {
      const { error, sub, fam } = decodeAndVerifyJwtToken(refreshCookie, TokenType.Refresh);
      // TODO: trigger alert (& revoke?)
      if (error === JwtError.Invalid) return {};
      if (error === JwtError.Outdated) return {};
      else if (!error && sub && fam) {
        const session = await getRefreshSession(req, sub, fam, refreshCookie);
        if (!session) return {};

        // Refresh session
        const { accessToken, refreshToken } = await refreshSession(session.id, sub, fam);

        setCookie(COOKIE_NAMES[TokenType.Access], accessToken, accessCookieOptions);
        setCookie(COOKIE_NAMES[TokenType.Refresh], refreshToken, refreshCookieOptions);

        return { userId: BigInt(sub) };
      }
    }
  } catch {
    return {};
  }

  return {};
}

export async function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
  const setCookie: SetCookie = (name: string, value: string, options: CookieOptions) => {
    resHeaders.append('set-cookie', getSetCookieString(name, value, options));
  };

  const authContext = await getAuthContext(req, setCookie);
  return { req, setCookie, ...authContext };
}
