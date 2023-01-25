import { BASE_TENANT } from '@okampus/shared/consts';

export function currentTenant() {
  const hostnameParts = window.location.hostname.split('.');
  if (hostnameParts.length > 2 && Number.isNaN(hostnameParts[hostnameParts.length - 1])) return hostnameParts[0];

  return BASE_TENANT;
}
