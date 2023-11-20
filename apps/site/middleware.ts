import { baseUrl, protocol } from './config';
import { availableLocales } from './config/i18n';

import { getLocale } from './server/ssr/getLang';

import { getDomainFromHostname } from './utils/get-domain-from-hostname';

import { ErrorCode } from './server/error';
import { LOCALE_COOKIE } from '@okampus/shared/consts';

import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const locales = Object.values(availableLocales);

function getLocaleFromPath(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.toString();
  const path = `${request.nextUrl.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // Return locale AND path without locale
  const hasLocale = locales.some((locale) => path.startsWith(`/${locale}/`) || path === `/${locale}`);
  if (hasLocale) {
    const locale = path.split('/')[1];
    const pathWithoutLocale = path.replace(`/${locale}`, '');
    return { locale, pathWithoutLocale };
  }

  const locale = getLocale(request.headers.get('accept-language'), request.cookies.get(LOCALE_COOKIE)?.value);
  return { locale, pathWithoutLocale: path };
}

export async function middleware(request: NextRequest) {
  const { locale, pathWithoutLocale } = getLocaleFromPath(request);

  const domain = getDomainFromHostname(request.headers.get('host') || request.nextUrl.hostname);
  if (!domain) {
    return request.nextUrl.pathname === '/connect'
      ? NextResponse.rewrite(`${protocol}://${baseUrl}/${locale}/connect`)
      : NextResponse.redirect(`${protocol}://${baseUrl}/connect`);
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
    const params = Object.entries({
      ...(pathWithoutLocale.startsWith('/manage/tenant') && { isDomainAdmin: true }),
      ...(pathWithoutLocale.startsWith('/manage/team') && { teamSlug: pathWithoutLocale.split('/')[2] }),
    })
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    const authUrl = params ? `${protocol}://${baseUrl}/api/auth` : `${protocol}://${baseUrl}/api/auth?${params}`;
    const authResponse = await fetch(authUrl, {
      headers: {
        Origin: `${protocol}://${domain}.${baseUrl}`,
        Cookie: request.cookies
          .getAll()
          .map(({ name, value }) => `${name}=${value}`)
          .join('; '),
      },
    });

    if (!authResponse.ok)
      return NextResponse.redirect(`${protocol}://${domain}.${baseUrl}/signin?error=${ErrorCode.Unauthorized}`);

    const setCookie = authResponse.headers.getSetCookie();
    if (setCookie.length > 0) {
      const headers = { 'Set-Cookie': setCookie[0] };
      return NextResponse.redirect(`${protocol}://${domain}.${baseUrl}${pathWithoutLocale}`, { headers });
    }
  }

  return NextResponse.rewrite(`${protocol}://${baseUrl}/${locale}/${domain}${pathWithoutLocale}`);
}

export const config = { matcher: ['/((?!_next/|_static/|_vercel|icons/|locales/|sw.+|manifest.+|[\\w-]+\\.\\w+).*)'] };
