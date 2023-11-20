import LogItem from './LogItem';
import Skeleton from '../../atoms/Skeleton/Skeleton';
import clsx from 'clsx';

import type { LogMinimal } from '../../../../types/prisma/Log/log-minimal';

export type LogHistoryProps = { className?: string; logs?: LogMinimal[]; loading?: boolean; error?: string };
export default function LogHistory({ className, logs, loading, error }: LogHistoryProps) {
  if (error) return <div className="p-2 bg-[var(--danger)] text-white font-semibold">Erreur : {error}</div>;

  return (
    <div className={clsx(className, 'flex flex-col gap-2')}>
      {loading
        ? Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} className="h-12" />)
        : (logs ?? []).map((log) => <LogItem key={log.id.toString()} log={log} />)}
    </div>
  );
}
