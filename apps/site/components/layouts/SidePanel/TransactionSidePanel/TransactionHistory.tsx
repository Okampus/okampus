import LogHistory from '../../../molecules/Log/LogHistory';
import { useGetTransactionLogsQuery } from '@okampus/shared/graphql';

import type { TransactionMinimalInfo } from '../../../../types/features/transaction.info';

export type TransactionHistoryProps = { transaction: TransactionMinimalInfo };
export default function TransactionHistory({ transaction }: TransactionHistoryProps) {
  const { data, loading, error } = useGetTransactionLogsQuery({
    context: { useApi: true },
    fetchPolicy: 'network-only',
    variables: { id: transaction.id },
  });

  return <LogHistory className="mt-4" logs={data?.transactionLogs} loading={loading} error={error} />;
}
