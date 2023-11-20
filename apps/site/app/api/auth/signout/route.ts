import { baseUrl, expiredCookieOptions, protocol } from '../../../../config';
import { getDomainFromHostname } from '../../../../utils/get-domain-from-hostname';

import { COOKIE_NAMES, EXPIRED_COOKIE } from '@okampus/shared/consts';
import { TokenType } from '@okampus/shared/enums';

import { cookies, headers as getHeaders } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  cookies().set(COOKIE_NAMES[TokenType.Access], EXPIRED_COOKIE, expiredCookieOptions);
  cookies().set(COOKIE_NAMES[TokenType.Refresh], EXPIRED_COOKIE, expiredCookieOptions);

  const headers = getHeaders();
  const origin = headers.get('origin') || headers.get('host'); // Disallow auth on other origins than current domain

  if (!origin) redirect(`${protocol}://${baseUrl}/signin`);

  const host = origin.includes(`${protocol}://`) ? origin.split(`${protocol}://`)[1] : origin;
  const domain = getDomainFromHostname(host);

  redirect(`${protocol}://${domain}.${baseUrl}/signin`);
}
