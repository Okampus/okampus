import { isNonEmptyString } from '../strings/non-empty';
import type { Cookie } from '@okampus/shared/types';

// Credits to: https://github.com/tomball, https://github.com/chrusart & https://github.com/nfriedly (MIT)

function parseString(setCookieValue: string) {
  const [nameValuePair, ...options] = setCookieValue.split(';').filter(isNonEmptyString);

  const [name, ...values] = nameValuePair.split('=');
  const value = decodeURIComponent(values.length > 0 ? values.join('=') : name);

  const cookie: Cookie = { name, value, options: {} };

  for (const option of options) {
    const [key, ...values] = option.split('=');
    const value = values.join('='); // everything after the first =, joined by a "=" if there was more than one part

    switch (key.trimStart().toLowerCase()) {
      case 'expires': {
        cookie.options.expires = new Date(value);
        break;
      }
      case 'max-age': {
        cookie.options.maxAge = Number.parseInt(value, 10);
        break;
      }
      case 'secure': {
        cookie.options.secure = true;
        break;
      }
      case 'httponly': {
        cookie.options.httpOnly = true;
        break;
      }
      case 'samesite': {
        if (value === 'lax' || value === 'strict' || value === 'none' || typeof value === 'boolean')
          cookie.options.sameSite = value;
        break;
      }
      default: {
        break;
      }
    }
  }

  return cookie;
}

export function parseSetCookieHeader(input: string | string[]) {
  if (!Array.isArray(input)) {
    input = [input];
  }

  const cookies: Record<string, Cookie> = {};
  for (const str of input) {
    if (!isNonEmptyString(str)) continue;
    const cookie = parseString(str);
    cookies[cookie.name] = cookie;
  }

  return cookies;
}
