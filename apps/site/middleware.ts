import { localePaths } from './config/i18n';
import { getLang } from './server/ssr/getLang';
import { LOCALE_COOKIE } from '@okampus/shared/consts';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = Object.values(localePaths).some(
    (localePath) => pathname.startsWith(`/${localePath}/`) || pathname === `/${localePath}`,
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = await getLang(request.headers.get('accept-language'), request.cookies.get(LOCALE_COOKIE)?.value);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return Response.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
