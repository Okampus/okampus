import LogItem from './LogItem';
import Skeleton from '../../atoms/Skeleton/Skeleton';
import clsx from 'clsx';

import type { LogMinimalInfo } from '../../../types/features/log.info';
import type { ApolloError } from '@apollo/client';

export type LogHistoryProps = { className?: string; logs?: LogMinimalInfo[]; loading?: boolean; error?: ApolloError };
export default function LogHistory({ className, logs, loading, error }: LogHistoryProps) {
  if (error) return <div className="p-2 bg-[var(--danger)] text-white font-semibold">Erreur : {error.message}</div>;

  return (
    <div className={clsx(className, 'flex flex-col gap-2')}>
      {loading
        ? Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} className="h-12" />)
        : (logs ?? []).map((log) => <LogItem key={log.id} log={log} />)}
    </div>
  );
}
