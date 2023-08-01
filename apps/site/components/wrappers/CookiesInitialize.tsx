'use client';

import { cookieConfig } from '../../utils/cookies';
import Cookies from 'universal-cookie';

export type CookiesInitializeProps = { cookies: [key: string, value: string][] };
export default function CookiesInitialize({ cookies }: CookiesInitializeProps) {
  const cookieStore = new Cookies();
  for (const [key, value] of cookies) {
    const cookieValue = cookieStore.get(key);
    if (cookieValue !== value) cookieStore.set(key, value, cookieConfig);
  }

  return null;
}
