import { BASE_TENANT } from '@okampus/shared/consts';

export function getTenantFromHost(host: string) {
  if (host.includes('okampus')) return host.split('.')[0];
  return BASE_TENANT;
}
