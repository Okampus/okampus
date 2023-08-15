'use client';

import SidePanel from '../SidePanel';
import GroupItem from '../../atoms/Item/GroupItem';
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
      <GroupItem heading="Historique" className="mt-[var(--py-content)] px-4" headingClassName="pb-4 px-2">
        <LogHistory logs={data?.eventLogs} loading={loading} error={error} />
      </GroupItem>
    </SidePanel>
  );
}
