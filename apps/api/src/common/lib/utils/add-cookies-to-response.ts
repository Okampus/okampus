import type { FastifyReply } from 'fastify';
import type { Cookie } from '@lib/types/interfaces/cookie';

export function addCookiesToResponse(cookies: Cookie[], res: FastifyReply): void {
  for (const cookie of cookies)
    void res.setCookie(cookie.name, cookie.value, cookie.options);
}
