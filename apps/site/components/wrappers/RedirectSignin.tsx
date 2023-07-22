'use client';

import { redirect, usePathname } from 'next/navigation';

export default function RedirectSignin() {
  const pathname = usePathname();
  if (pathname === 'signin') {
    localStorage.setItem('next', '/');
  } else {
    localStorage.setItem('next', pathname ?? '/');
    redirect('/signin');
  }

  return null;
}
