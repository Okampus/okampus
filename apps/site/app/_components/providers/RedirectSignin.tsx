'use client';

import { safeCookieOptions } from '../../../config';

import { NEXT_PAGE_COOKIE } from '@okampus/shared/consts';

import { redirect, usePathname } from 'next/navigation';
import Cookies from 'universal-cookie';

import type { ErrorCode } from '../../../server/error';

export default function RedirectSignin({ error }: { error?: ErrorCode }) {
  const pathname = usePathname();
  const cookieStore = new Cookies();
  const next = pathname === 'signin' ? '/' : pathname ?? '/';
  cookieStore.set(NEXT_PAGE_COOKIE, next, { ...safeCookieOptions, maxAge: 120 });

  if (pathname !== 'signin' || error) redirect(error ? `/signin/?error=${error}` : '/signin');
  return null;
}
