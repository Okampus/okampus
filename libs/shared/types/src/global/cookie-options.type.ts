export type CookieOptions = {
  expires?: number | Date;
  path?: string;
  domain?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
  httpOnly?: boolean;
};
