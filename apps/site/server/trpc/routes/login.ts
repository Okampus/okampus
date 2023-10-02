import { publicProcedure } from '../trpc';
import { createSession } from '../auth/sessions';
import { loginDto } from '../dtos/login';
import { passwordHashSecret } from '../../../config/secrets';
import { accessCookieOptions, refreshCookieOptions } from '../../../config';
import { prisma } from '../../../database/prisma/db';

import { COOKIE_NAMES } from '@okampus/shared/consts';
import { TokenType } from '@okampus/shared/enums';
import { TRPCError } from '@trpc/server';
import { verify } from 'argon2';

export const login = publicProcedure.input(loginDto).mutation(async ({ input: { username, password }, ctx }) => {
  const user = await prisma.user.findFirst({ where: { OR: [{ actor: { email: username } }, { slug: username }] } });
  if (!user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User does not exist.' });
  if (!user.passwordHash) throw new Error('User has no password');

  const isPasswordValid = await verify(user.passwordHash, password, { secret: passwordHashSecret });
  if (!isPasswordValid) throw new Error('Invalid credentials.');

  const { accessToken, refreshToken } = await createSession(ctx.req, user.id.toString());
  ctx.setCookie(COOKIE_NAMES[TokenType.Access], accessToken, accessCookieOptions);
  ctx.setCookie(COOKIE_NAMES[TokenType.Refresh], refreshToken, refreshCookieOptions);

  return user.slug;
});
