'use client';

import SidePanel from '../SidePanel';
import SimpleList from '../../molecules/List/SimpleList';
import LogHistory from '../../molecules/Log/LogHistory';

import { useGetTeamLogsQuery } from '@okampus/shared/graphql';

export type TeamManageSidePanelProps = { id: string };
export default function TeamManageSidePanel({ id }: TeamManageSidePanelProps) {
  const { data, loading, error } = useGetTeamLogsQuery({
    variables: { id },
    context: { useApi: true },
    fetchPolicy: 'network-only',
  });

  return (
    <SidePanel>
      <SimpleList heading="Historique" className="mt-[var(--py-content)] px-4" headingClassName="pb-4 px-2">
        <LogHistory logs={data?.teamLogs} loading={loading} error={error} />
      </SimpleList>
    </SidePanel>
  );
}
