'use client';

import SidePanel from '../SidePanel';
import SimpleList from '../../molecules/List/SimpleList';
import LogHistory from '../../molecules/Log/LogHistory';
import { useGetTenantLogsQuery } from '@okampus/shared/graphql';

export type TenantManageSidePanelProps = { id: string };
export default function TenantManageSidePanel({ id }: TenantManageSidePanelProps) {
  const { data, loading, error } = useGetTenantLogsQuery({
    variables: { id },
    context: { useApi: true },
    fetchPolicy: 'network-only',
  });

  return (
    <SidePanel>
      <SimpleList heading="Historique" className="mt-[var(--py-content)] px-4" headingClassName="pb-4 px-2">
        <LogHistory logs={data?.tenantLogs} loading={loading} error={error} />
      </SimpleList>
    </SidePanel>
  );
}
