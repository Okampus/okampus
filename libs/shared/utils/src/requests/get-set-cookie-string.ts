import type { CookieOptions } from '@okampus/shared/types';

export function getSetCookieString(cookieName: string, cookieValue: string, options: CookieOptions = {}) {
  const { expires, path, domain, secure, httpOnly, sameSite } = options;

  let cookieString = `${encodeURIComponent(cookieName)}=${encodeURIComponent(cookieValue)}`;

  if (expires) {
    if (expires instanceof Date) cookieString += `; expires=${expires.toUTCString()}`;
    else {
      const expirationDate = new Date(Date.now() + expires); // Expires in seconds
      cookieString += `; expires=${expirationDate.toUTCString()}`;
    }
  }

  if (path) cookieString += `; path=${path}`;
  if (domain) cookieString += `; domain=${domain}`;
  if (httpOnly) cookieString += `; httponly`;
  if (secure) cookieString += `; secure`;
  if (sameSite) cookieString += `; samesite=${sameSite}`;

  return cookieString;
}
