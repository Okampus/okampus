import LogHistory from '../../../molecules/Log/LogHistory';
import { trpcClient } from '../../../../_context/trpcClient';

import type { TransactionMinimalInfo } from '../../../../../types/features/transaction.info';

export type TransactionHistoryProps = { transaction: TransactionMinimalInfo };
export default function TransactionHistory({ transaction }: TransactionHistoryProps) {
  const { data, isLoading, error } = trpcClient.getTransactionLogs.useQuery(transaction.id);

  return <LogHistory className="mt-4" logs={data} loading={isLoading} error={error?.message} />;
}
