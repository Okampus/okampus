'use server';

import { baseUrl, protocol } from '../../config';
import { ForbiddenError, ServerError, UnauthorizedError } from '../../server/error';
import { cookies } from 'next/headers';
import type { UserMe } from '../../types/prisma/User/user-me';

export async function fetchMe(domain: string) {
  const fetchMeResponse = await fetch(`${protocol}://${domain}.${baseUrl}/api/me`, {
    headers: { Cookie: cookies().toString() },
  });
  if (!fetchMeResponse.ok) {
    const error = await fetchMeResponse.json();
    if (fetchMeResponse.status === 401) throw new UnauthorizedError(error.message);
    else if (fetchMeResponse.status === 403) throw new ForbiddenError(error.message);
    else throw new ServerError(error.message);
  }

  const user: UserMe = await fetchMeResponse.json();
  return user;
}
