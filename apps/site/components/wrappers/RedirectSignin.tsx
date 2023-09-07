'use client';

import { cookieConfig } from '../../utils/cookies';
import { NEXT_PAGE_COOKIE } from '@okampus/shared/consts';

import { redirect, usePathname } from 'next/navigation';
import Cookies from 'universal-cookie';

export default function RedirectSignin() {
  const pathname = usePathname();

  const cookieStore = new Cookies();
  const next = pathname === 'signin' ? '/' : pathname ?? '/';
  cookieStore.set(NEXT_PAGE_COOKIE, next, cookieConfig);

  console.log('Next redirect', next);
  if (pathname !== 'signin') redirect('/signin');
  return null;
}
