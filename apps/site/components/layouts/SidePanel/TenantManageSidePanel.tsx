'use client';

import SidePanel from '../SidePanel';
import GroupItem from '../../atoms/Item/GroupItem';
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
      <GroupItem heading="Historique" className="mt-[var(--py-content)] px-4" headingClassName="pb-4 px-2">
        <LogHistory logs={data?.tenantLogs} loading={loading} error={error} />
      </GroupItem>
    </SidePanel>
  );
}
