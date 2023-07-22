import LogHistory from '../../../molecules/Log/LogHistory';
import { logBaseInfo, useTypedQuery } from '@okampus/shared/graphql';
import type { FinanceBaseInfo } from '@okampus/shared/graphql';

export type FinanceHistoryProps = { finance: FinanceBaseInfo };
export default function FinanceHistory({ finance }: FinanceHistoryProps) {
  const { data, loading, error } = useTypedQuery(
    { financeLogs: [{ id: finance.id }, logBaseInfo] },
    { apolloOptions: { context: { useApi: true }, fetchPolicy: 'network-only' } }
  );

  return <LogHistory logs={data?.financeLogs} loading={loading} error={error} />;
}
