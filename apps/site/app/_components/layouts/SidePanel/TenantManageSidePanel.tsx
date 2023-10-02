'use client';

import SidePanel from '../SidePanel';
import SimpleList from '../../molecules/List/SimpleList';
import LogHistory from '../../molecules/Log/LogHistory';
import { trpcClient } from '../../../_context/trpcClient';

export type TenantManageSidePanelProps = { id: string };
export default function TenantManageSidePanel({ id }: TenantManageSidePanelProps) {
  const { data, isLoading, error } = trpcClient.getTransactionLogs.useQuery(id);

  return (
    <SidePanel>
      <SimpleList heading="Historique" className="mt-[var(--py-content)] px-4" headingClassName="pb-4 px-2">
        <LogHistory logs={data} loading={isLoading} error={error?.message} />
      </SimpleList>
    </SidePanel>
  );
}
