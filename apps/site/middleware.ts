import { baseUrl, protocol } from './config';

import { ErrorCode } from './server/error';
import { availableLocales, fallbackLocale, getLocale } from './server/ssr/getLang';

import { getDomainFromHostname } from './utils/get-domain-from-hostname';

import { LOCALE_COOKIE } from '@okampus/shared/consts';
import { buildUrl } from '@okampus/shared/utils';

import debug from 'debug';
import createIntlMiddleware from 'next-intl/middleware';

import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

function getLocaleFromPath(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.toString();
  const path = `${request.nextUrl.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // Return locale AND path without locale
  const hasLocale = availableLocales.some((locale) => path.startsWith(`/${locale}/`) || path === `/${locale}`);
  if (hasLocale) {
    const locale = path.split('/')[1];
    const pathWithoutLocale = path.replace(`/${locale}`, '');
    return { locale, pathWithoutLocale };
  }

  const locale = getLocale(request.headers.get('accept-language'), request.cookies.get(LOCALE_COOKIE)?.value);
  return { locale, pathWithoutLocale: path };
}

const debugLog = debug('okampus:middleware');
export async function middleware(request: NextRequest) {
  const { locale, pathWithoutLocale } = getLocaleFromPath(request);

  const handleI18nRouting = createIntlMiddleware({
    locales: availableLocales,
    defaultLocale: fallbackLocale,
  });

  const domain = getDomainFromHostname(request.headers.get('host') || request.nextUrl.hostname);
  debugLog(request.nextUrl.pathname, locale, pathWithoutLocale, domain);

  if (!domain) {
    if (request.nextUrl.pathname === '/connect') {
      request.nextUrl.hostname = baseUrl;
      request.nextUrl.pathname = `/${locale}/connect`;
    } else return NextResponse.redirect(`${protocol}://${baseUrl}/connect`);

    const response = handleI18nRouting(request);
    return response;
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    return NextResponse.next({
      headers: origin?.endsWith(baseUrl)
        ? {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
            'Access-Control-Allow-Headers':
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          }
        : { 'Access-Control-Allow-Origin': 'null' },
    });
  }

  if (!request.nextUrl.pathname.startsWith('/signin')) {
    const params = {
      ...(pathWithoutLocale.startsWith('/manage/tenant') && { isDomainAdmin: true }),
      ...(pathWithoutLocale.startsWith('/manage/team') && { teamSlug: pathWithoutLocale.split('/')[3] }),
    };

    debugLog('Auth params', { params });

    const authResponse = await fetch(buildUrl(`${protocol}://${baseUrl}/api/auth`, params), {
      headers: {
        Origin: `${protocol}://${domain}.${baseUrl}`,
        Cookie: request.cookies
          .getAll()
          .map(({ name, value }) => `${name}=${value}`)
          .join('; '),
      },
    });

    if (!authResponse.ok) {
      const error = await authResponse.text();
      debugLog('Auth failed!', authResponse.status, error, authResponse.statusText);
      if (authResponse.status === 401)
        return NextResponse.redirect(`${protocol}://${domain}.${baseUrl}/signin?error=${ErrorCode.Unauthorized}`);
      if (authResponse.status === 404) {
        if (error === 'NOT_FOUND_TENANT')
          return NextResponse.redirect(`${protocol}://${baseUrl}/connect?error=${ErrorCode.NotFound}`);
        if (error === 'NOT_FOUND_TEAM')
          return NextResponse.redirect(`${protocol}://${domain}.${baseUrl}/?error=${ErrorCode.NotFound}`);
      }
      return NextResponse.redirect(`${protocol}://${domain}.${baseUrl}/?error=${ErrorCode.Forbidden}`);
    }

    const setCookie = authResponse.headers.getSetCookie();
    if (setCookie.length > 0) {
      const headers = { 'Set-Cookie': setCookie[0] };
      return NextResponse.redirect(`${protocol}://${domain}.${baseUrl}${pathWithoutLocale}`, { headers });
    }
  }

  request.nextUrl.hostname = `${baseUrl}`;
  request.nextUrl.pathname = `/${locale}/${domain}${pathWithoutLocale.split('?')[0]}`; // Strip query params as they are already in the URL

  debugLog('Redirect to', request.nextUrl.toString());
  const response = handleI18nRouting(request);
  return response;
}

export const config = { matcher: ['/((?!_next/|_static/|_vercel|icons/|locales/|sw.+|manifest.+|[\\w-]+\\.\\w+).*)'] };
