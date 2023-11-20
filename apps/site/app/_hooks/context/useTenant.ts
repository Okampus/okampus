import { useMe } from './useMe';

export function useTenant() {
  const me = useMe();
  return { ...me, data: me.data.tenantScope };
}
