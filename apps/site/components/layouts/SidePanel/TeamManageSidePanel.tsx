'use client';

import SidePanel from '../SidePanel';
import LogHistory from '../../molecules/Log/LogHistory';
import { logBaseInfo, useTypedQuery } from '@okampus/shared/graphql';

export type TeamManageSidePanelProps = { id: string };
export default function TeamManageSidePanel({ id }: TeamManageSidePanelProps) {
  const { data, loading, error } = useTypedQuery(
    { teamLogs: [{ id }, logBaseInfo] },
    { apolloOptions: { context: { useApi: true }, fetchPolicy: 'network-only' } }
  );

  console.log('Data', data);

  return (
    <SidePanel>
      <LogHistory logs={data?.teamLogs} loading={loading} error={error} />
    </SidePanel>
  );
}
