import { localePaths } from './config/i18n';
import { getLang } from './server/ssr/getLang';
import { LOCALE_COOKIE } from '@okampus/shared/consts';
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
  const { locale, pathWithoutLocale } = getLocaleFromPath(req);
  const hostname = req.headers.get('host');

  return NextResponse.rewrite(new URL(`/${locale}/${hostname}${pathWithoutLocale}`, req.url));
}

export const config = { matcher: ['/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)'] };
