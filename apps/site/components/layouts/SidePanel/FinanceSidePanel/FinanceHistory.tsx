import LogHistory from '../../../molecules/Log/LogHistory';
import { useGetFinanceLogsQuery } from '@okampus/shared/graphql';

import type { FinanceMinimalInfo } from '../../../../types/features/finance.info';

export type FinanceHistoryProps = { finance: FinanceMinimalInfo };
export default function FinanceHistory({ finance }: FinanceHistoryProps) {
  const { data, loading, error } = useGetFinanceLogsQuery({
    context: { useApi: true },
    fetchPolicy: 'network-only',
    variables: { id: finance.id },
  });

  return <LogHistory logs={data?.financeLogs} loading={loading} error={error} />;
}
