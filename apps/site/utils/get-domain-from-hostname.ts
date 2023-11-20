import { baseUrl } from '../config';

export function getDomainFromHostname(hostname: string) {
  return hostname.replace(baseUrl, '').slice(0, -1);
}
