import { WEEKDAYS_SHORT } from '@okampus/shared/consts';
import { clsx } from 'clsx';

const dateDayFormatter = new Intl.DateTimeFormat('fr', { day: 'numeric', month: 'short' });
const hourFormatter = new Intl.DateTimeFormat('fr', { hour: 'numeric', minute: 'numeric' });

export type DateInfoProps = { start: string | Date; end?: string | Date; small?: boolean; className?: string };
export function DateInfo({ start, end, small, className }: DateInfoProps) {
  start = new Date(start);
  end = end ? new Date(end) : undefined;

  const now = new Date();
  const year = start.getFullYear();

  const isNotSameYear = year !== now.getFullYear();
  const startDateDay = dateDayFormatter.format(start);

  const dateDayLine = (
    <div className="text-lg font-bold tracking-tight">
      {startDateDay} {isNotSameYear && year}
    </div>
  );
  const startLine = (
    <div className="subtitle-sm capitalize">
      <div className="w-10 inline-block tracking-tight">{WEEKDAYS_SHORT[start.getDay()]}.</div>
      <div className="inline-block tabular-nums">{hourFormatter.format(start)}</div>
    </div>
  );

  if (!end)
    return (
      <div className={clsx('flex flex-col', className)}>
        {dateDayLine}
        {startLine}
      </div>
    );

  const isSameDay = start.getDate() === end.getDate() && start.getMonth() === end.getMonth();
  const endLine = (
    <div className="subtitle-sm opacity-[0.75] -mt-1">
      <div className="w-10 inline-block tracking-tight">
        {isSameDay ? <span className="px-1">⟶</span> : `${WEEKDAYS_SHORT[end.getDay()]}.`}
      </div>
      <div className="inline-block tabular-nums">{hourFormatter.format(end)} (fin)</div>
    </div>
  );

  return (
    <div className={clsx('flex flex-col', className)}>
      {dateDayLine}
      {startLine}
      {endLine}
    </div>
  );
}
