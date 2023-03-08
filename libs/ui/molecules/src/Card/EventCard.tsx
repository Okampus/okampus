import { EventState } from '@okampus/shared/enums';
import { formatDateRange } from '@okampus/shared/utils';

import { clsx } from 'clsx';
import type { ITenantEvent } from '@okampus/shared/dtos';

type EventCardProps = {
  event: ITenantEvent;
  classes?: string;
  onClick?: () => void;
};

export function EventCard({ event, classes, onClick }: EventCardProps) {
  const dateRange = formatDateRange(event.start, event.end);
  return (
    <div
      className={clsx('flex flex-col gap-2 border border-color-2 rounded-lg bg-2 py-2 px-4', classes)}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-0">{event.title}</div>
          <div className="text-2">{dateRange}</div>
        </div>
        {event.state === EventState.Approved ? (
          <div className="rounded-lg bg-green-500 text-white py-0.5 px-2">Validé</div>
        ) : event.state === EventState.Rejected ? (
          <div className="rounded-lg bg-red-400 text-white py-0.5 px-2">Refusé</div>
        ) : (
          <div className="rounded-lg bg-opposite text-opposite py-0.5 px-2">
            En attente de validation {event.lastEventApprovalStep?.order ?? 0}/3
          </div>
        )}
      </div>
    </div>
  );
}
