'use client';

import { NEXT_PAGE_COOKIE } from '@okampus/shared/consts';
import Cookies from 'universal-cookie';
import { redirect, usePathname } from 'next/navigation';

export default function RedirectSignin() {
  const pathname = usePathname();

  const cookieStore = new Cookies();
  cookieStore.set(NEXT_PAGE_COOKIE, pathname === 'signin' ? '/' : pathname ?? '/', {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  if (pathname !== 'signin') redirect('/signin');
  return null;
}
