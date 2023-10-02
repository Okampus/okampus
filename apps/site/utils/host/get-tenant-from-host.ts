import { baseTenantDomain } from '../../config';
import { BASE_TENANT_NAME } from '@okampus/shared/consts';

export function getTenantFromHost(host: string) {
  if (host.includes('okampus')) return host.split('.')[0];
  return baseTenantDomain ?? BASE_TENANT_NAME;
}
