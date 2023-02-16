import type { CookieSerializeOptions } from '@fastify/cookie';

export interface Cookie {
  value: string;
  name: string;
  options: CookieSerializeOptions;
}
