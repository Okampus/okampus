'use client';

import SidePanel from '../SidePanel';
import LogHistory from '../../molecules/Log/LogHistory';
import { logBaseInfo, useTypedQuery } from '@okampus/shared/graphql';

export type TenantManageSidePanelProps = { id: string };
export default function TenantManageSidePanel({ id }: TenantManageSidePanelProps) {
  const { data, loading, error } = useTypedQuery(
    { tenantLogs: [{ id }, logBaseInfo] },
    { apolloOptions: { context: { useApi: true }, fetchPolicy: 'network-only' } }
  );

  return (
    <SidePanel>
      <LogHistory logs={data?.tenantLogs} loading={loading} error={error} />
    </SidePanel>
  );
}
