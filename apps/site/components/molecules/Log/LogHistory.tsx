import LogItem from './LogItem';
import Skeleton from '../../atoms/Skeleton/Skeleton';

import type { LogBaseInfo } from '@okampus/shared/graphql';
import type { ApolloError } from '@apollo/client';

export type LogHistoryProps = { logs?: LogBaseInfo[]; loading?: boolean; error?: ApolloError };
export default function LogHistory({ logs, loading, error }: LogHistoryProps) {
  if (error) return <div className="p-2 bg-[var(--danger)] text-white font-semibold">Erreur : {error.message}</div>;

  return (
    <div className="flex flex-col gap-2">
      {loading
        ? Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} className="h-12" />)
        : (logs ?? []).map((log) => <LogItem key={log.id} log={log} />)}
    </div>
  );
}
