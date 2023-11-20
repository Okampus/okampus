'use client';

import Sidepanel from '../Sidepanel';
// import LogHistory from '../../molecules/Log/LogHistory';
// import { trpcClient } from '../../../_context/trpcClient';

export type TeamManageSidePanelProps = { id: bigint };
export default function TeamManageSidePanel({ id }: TeamManageSidePanelProps) {
  // const { data, isLoading, error } = trpcClient.getTransactionLogs.useQuery(id);

  return (
    <Sidepanel>
      {/*       < heading="Historique" className="mt-[var(--py-content)] px-4" headingClassName="pb-4 px-2"> */}
      {/* <LogHistory logs={data} loading={isLoading} error={error?.message} /> */}
      {/*       </> */}
    </Sidepanel>
  );
}
