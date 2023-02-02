import { ITenantEvent } from '@okampus/shared/dtos';
import { EventState } from '@okampus/shared/enums';
import { formatDateRange } from '@okampus/shared/utils';
import { Avatar } from '@okampus/ui/atoms';

import { clsx } from 'clsx';

type EventCardProps = {
  event: ITenantEvent;
  classes?: string;
  onClick?: () => void;
};

export function EventCard({ event, classes, onClick }: EventCardProps) {
  // console.log('event', event);
  const dateRange = formatDateRange(event.start, event.end);
  // console.log('dateRange', dateRange);
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
      <div className="flex gap-6">
        <div className="flex gap-2 items-center text-2">
          <Avatar
            src="https://cdn.discordapp.com/icons/827518251608178728/3f066f2e311cac3391786c1b1872adc7.webp?size=96"
            name={event.rootContent?.representingOrg?.actor?.name}
          />
          <div>{event.rootContent?.representingOrg?.actor?.name ?? '?'}</div>
        </div>
        <div className="flex gap-2 items-center text-2">
          <Avatar name={'Ivan STEPANIAN'} />
          <div>{'Ivan STEPANIAN'}</div>
        </div>
      </div>
      {/* <div className="text-1">{(event.rootContent as IContent).text}</div> */}
    </div>
  );
}
