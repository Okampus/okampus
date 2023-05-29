import { DateInfo } from '../Content/DateInfo';
import { ActionButton } from '../Button/ActionButton';
import { TextAddress } from '@okampus/ui/atoms';
import { EVENT_ROUTE } from '@okampus/shared/consts';
import { Link } from 'react-router-dom';
import { ActionType } from '@okampus/shared/types';
import type { EventBaseInfo } from '@okampus/shared/graphql';

export type EventItemProps = { event: EventBaseInfo };
export function EventItem({ event }: EventItemProps) {
  return (
    <div className="relative">
      <Link to={EVENT_ROUTE(event.contentMaster?.slug)} className="absolute inset-0 z-10" />
      <div className="flex items-center justify-between">
        <div className="flex items-start py-2 lg:px-3">
          <DateInfo start={event.start as string} end={event.end as string} className="pt-1 w-40 shrink-0" />
          <div className="flex flex-col line-clamp-1">
            <div className="title-sm">{event.contentMaster?.name}</div>
            <TextAddress address={event.actorAddress} className="line-clamp-1" />
            <div className="text-2 line-clamp-1">
              <span className="md:hidden text-0 font-medium pr-2">
                {event.price > 0 ? `${event.price}€` : 'Gratuit'}
              </span>{' '}
              {/* Volontaire(s) recherché(s): <span className="underline">1x reponsable de vestiaire</span> */}
            </div>
            {/* <div className="text-2 font-medium line-clamp-2">{event.contentMaster?.content.text}</div> */}
          </div>
        </div>
        <ActionButton
          className="w-40 md-max:!hidden"
          action={{
            type: ActionType.Action,
            linkOrActionOrMenu: EVENT_ROUTE(event.contentMaster?.slug),
            label: event.price > 0 ? `${event.price}€` : 'Gratuit',
          }}
        />
      </div>
    </div>
  );
}
