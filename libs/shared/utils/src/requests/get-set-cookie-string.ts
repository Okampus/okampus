import type { CookieOptions } from '@okampus/shared/types';

export function getSetCookieString(cookieName: string, cookieValue: string, options: CookieOptions = {}) {
  const { expires, maxAge, path, domain, secure, httpOnly, sameSite } = options;

  let cookieString = `${encodeURIComponent(cookieName)}=${encodeURIComponent(cookieValue)}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  } else if (maxAge) {
    cookieString += `; max-age=${maxAge}`; // Max age in seconds
  }

  if (path) cookieString += `; path=${path}`;
  if (domain) cookieString += `; domain=${domain}`;
  if (httpOnly) cookieString += `; httponly`;
  if (secure) cookieString += `; secure`;
  if (sameSite) cookieString += `; samesite=${sameSite}`;

  return cookieString;
}
