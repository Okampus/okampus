'use client';

import Sidepanel from '../Sidepanel';
// import LogHistory from '../../molecules/Log/LogHistory';
// import { trpcClient } from '../../../_context/trpcClient';

export type TenantManageSidePanelProps = { id: bigint };
export default function TenantManageSidePanel({ id }: TenantManageSidePanelProps) {
  // const { data, isLoading, error } = trpcClient.getTransactionLogs.useQuery(id);

  return (
    <Sidepanel>
      {/*       < heading="Historique" className="mt-[var(--py-content)] px-4" headingClassName="pb-4 px-2"> */}
      {/* <LogHistory logs={data} loading={isLoading} error={error?.message} /> */}
      {/*       </> */}
    </Sidepanel>
  );
}
