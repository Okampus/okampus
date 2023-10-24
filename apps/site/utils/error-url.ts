import { urlJoin } from './url-join';
import { baseUrl } from '../config';

export type ErrorUrlOptions = { errorCode: string; route?: string; domain?: string };
export function errorUrl({ errorCode, route, domain }: ErrorUrlOptions) {
  if (domain) return urlJoin(`https://${domain}.${baseUrl}`, route, `/?error=${errorCode}`);
  return urlJoin(`https://okampus.fr`, route, `/?error=${errorCode}`);
}
