import { Cookie } from '@okampus/shared/types';
import type { FastifyReply } from 'fastify';

export function addCookiesToResponse(cookies: Cookie[], res: FastifyReply): void {
  for (const cookie of cookies) void res.setCookie(cookie.name, cookie.value, cookie.options);
}
