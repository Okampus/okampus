'use client';

import { safeCookieOptions } from '../../../config';
import Cookies from 'universal-cookie';

export type CookiesInitializeProps = { cookies: [key: string, value: string][] };
export default function CookiesInitialize({ cookies }: CookiesInitializeProps) {
  const cookieStore = new Cookies();
  for (const [key, value] of cookies) {
    const cookieValue = cookieStore.get(key);
    if (cookieValue !== value) cookieStore.set(key, value, { ...safeCookieOptions, expires: new Date(2030, 0, 1) });
  }

  return null;
}
