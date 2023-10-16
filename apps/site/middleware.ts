import { baseUrl, protocol } from './config';
import { localePaths } from './config/i18n';
import { getLang } from './server/ssr/getLang';

import { COOKIE_NAMES, LOCALE_COOKIE } from '@okampus/shared/consts';
import { TokenType } from '@okampus/shared/enums';

import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const locales = Object.values(localePaths);

function getLocaleFromPath(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${req.nextUrl.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // Return locale AND path without locale
  const hasLocale = locales.some((locale) => path.startsWith(`/${locale}/`) || path === `/${locale}`);
  if (hasLocale) {
    const locale = path.split('/')[1];
    const pathWithoutLocale = path.replace(`/${locale}`, '');
    return { locale, pathWithoutLocale };
  }

  const locale = getLang(req.headers.get('accept-language'), req.cookies.get(LOCALE_COOKIE)?.value);
  return { locale, pathWithoutLocale: path };
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const origin = req.headers.get('origin');
    return NextResponse.next({
      headers: origin?.endsWith(baseUrl)
        ? {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
            'Access-Control-Allow-Headers':
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          }
        : {
            'Access-Control-Allow-Origin': 'null',
          },
    });
  }

  const { locale, pathWithoutLocale } = getLocaleFromPath(req);
  console.log({ locale, pathWithoutLocale });

  if (pathWithoutLocale.startsWith('/signin')) {
    if (pathWithoutLocale === '/signin') {
      const accessToken = req.cookies.get(COOKIE_NAMES[TokenType.Access])?.value;
      if (accessToken) return NextResponse.redirect(new URL('/signin/tenant', req.url));
    }
    return NextResponse.rewrite(new URL(`/${locale}${pathWithoutLocale}`, req.url));
  }

  const hostname = req.headers.get('host') || req.nextUrl.hostname;
  const domain = hostname.replace(baseUrl, '').slice(0, -1);
  const rewritePath = domain ? `/${locale}/${domain}${pathWithoutLocale}` : `/${locale}${pathWithoutLocale}`;

  console.log({
    domain,
    hostname,
    rewritePath,
    url: new URL(rewritePath, `${protocol}://${baseUrl}`).toString(),
  });

  return NextResponse.rewrite(new URL(rewritePath, `${protocol}://${baseUrl}`));
}

export const config = { matcher: ['/((?!_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)'] };
