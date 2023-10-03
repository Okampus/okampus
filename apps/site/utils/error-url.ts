import { urlJoin } from './url-join';
import { isProduction } from '../config';

export type ErrorUrlOptions = { errorCode: string; route?: string; domain?: string };
export function errorUrl({ errorCode, route, domain }: ErrorUrlOptions) {
  if (isProduction) return urlJoin('http://localhost:3000', `/?error=${errorCode}`);
  if (domain) return urlJoin(`https://${domain}.okampus.fr`, route, `/?error=${errorCode}`);
  return urlJoin(`https://okampus.fr`, route, `/?error=${errorCode}`);
}
