'use client';

import SidePanel from '../SidePanel';
import LogHistory from '../../molecules/Log/LogHistory';
import { logBaseInfo, useTypedQuery } from '@okampus/shared/graphql';

export type EventManageSidePanelProps = { id: string };
export default function EventManageSidePanel({ id }: EventManageSidePanelProps) {
  const { data, loading, error } = useTypedQuery(
    { eventLogs: [{ id }, logBaseInfo] },
    { apolloOptions: { context: { useApi: true }, fetchPolicy: 'network-only' } }
  );

  return (
    <SidePanel>
      <LogHistory logs={data?.eventLogs} loading={loading} error={error} />
    </SidePanel>
  );
}
