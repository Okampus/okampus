'use client';

import SidePanel from '../SidePanel';
import SimpleList from '../../molecules/List/SimpleList';
import LogHistory from '../../molecules/Log/LogHistory';
import { useGetEventLogsQuery } from '@okampus/shared/graphql';

export type EventManageSidePanelProps = { id: string };
export default function EventManageSidePanel({ id }: EventManageSidePanelProps) {
  const { data, loading, error } = useGetEventLogsQuery({
    variables: { id },
    context: { useApi: true },
    fetchPolicy: 'network-only',
  });

  return (
    <SidePanel>
      <SimpleList heading="Historique" className="mt-[var(--py-content)] px-4" headingClassName="pb-4 px-2">
        <LogHistory logs={data?.eventLogs} loading={loading} error={error} />
      </SimpleList>
    </SidePanel>
  );
}
