import { ActionButton } from '../Button/ActionButton';
import { ReactComponent as TimeOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/time.svg';
import { ReactComponent as LocationOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/location.svg';

import { EVENT_ROUTE } from '@okampus/shared/consts';
import { formatDateRangeDayOfWeek } from '@okampus/shared/utils';
import { TextAddress } from '@okampus/ui/atoms';

import { Link } from 'react-router-dom';

import type { EventBaseInfo } from '@okampus/shared/graphql';

export type EventPopoverCardProps = { event: EventBaseInfo };
export function EventPopoverCard({ event }: EventPopoverCardProps) {
  return (
    <div className="bg-0 rounded-xl flex flex-col gap-4 text-2 w-[30rem] p-6">
      <Link to={EVENT_ROUTE(event?.slug)} className="title">
        {event?.name}
      </Link>
      <div className="flex gap-3 items-center">
        <TimeOutlinedIcon className="w-5 h-5 text-3 shrink-0" />
        <div>{formatDateRangeDayOfWeek(event.start as string, event.end as string)}</div>
      </div>
      <div className="flex gap-3 items-start">
        <LocationOutlinedIcon className="w-5 h-5 text-3 shrink-0" />
        <TextAddress address={event.address} />
      </div>
      <div className="line-clamp-4">{event?.content?.text}</div>
      <ActionButton
        action={{
          label: 'Voir les détails',
          linkOrActionOrMenu: EVENT_ROUTE(event?.slug),
        }}
      />
    </div>
  );
}
