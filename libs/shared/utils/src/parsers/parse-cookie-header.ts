export function parseCookieHeader(cookie?: string) {
  if (!cookie) return {};

  const cookiesArray = cookie.split(';');
  const parsedCookie: { [key: string]: string } = {};

  for (const cookieItem of cookiesArray) {
    const [key, value] = cookieItem.split('=');
    parsedCookie[key.trim()] = value;
  }

  return parsedCookie;
}
