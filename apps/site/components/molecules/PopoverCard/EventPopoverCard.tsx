import ActionButton from '../Button/ActionButton';
import TeamLabeled from '../Labeled/TeamLabeled';
// import CloseButtonIcon from '../../atoms/Icon/CloseButtonIcon';
import BannerImage from '../../atoms/Image/BannerImage';
import TextLocation from '../../atoms/Text/TextLocation';

import { EVENT_ROUTE } from '@okampus/shared/consts';
import { formatDateRangeDayOfWeek } from '@okampus/shared/utils';

import { IconAlignLeft, IconLocation, IconPencil, IconUsers } from '@tabler/icons-react';
import Link from 'next/link';

import type { EventBaseInfo } from '@okampus/shared/graphql';

export type EventPopoverCardProps = { event: EventBaseInfo };
export default function EventPopoverCard({ event }: EventPopoverCardProps) {
  const displayedTimeRange = formatDateRangeDayOfWeek(event.start, event.end).replaceAll('.', '');

  return (
    <div className="relative bg-main shadow-lg dark:shadow-[#333] rounded-2xl w-[34rem]">
      {/* <CloseButtonIcon className="absolute right-4 top-4" onClick={onClose} /> */}
      <BannerImage className="rounded-t-2xl" name={event.name} aspectRatio={4.5} src={event?.banner?.url} />
      <div className="px-10 py-8">
        <Link href={EVENT_ROUTE(event?.slug)} className="text-2xl font-bold text-1">
          {event?.name}
        </Link>
        <div className="text-primary font-semibold tabular-nums capitalize">{displayedTimeRange}</div>
        <div className="grid grid-cols-[1.25rem_1fr] gap-4 my-8">
          <IconUsers className="h-6 w-6 mt-1.5" />
          <div className="flex flex-wrap">
            {event.eventOrganizes.map((eventManage, index) => (
              <>
                <TeamLabeled team={eventManage.team} className="text-lg" />
                {index < event.eventOrganizes.length - 1 && <span className="mx-1">×</span>}
              </>
            ))}
          </div>
          <IconLocation className="h-6 w-6" />
          <TextLocation location={event?.location} />
          {event?.location?.locationDetails && (
            <>
              <IconAlignLeft />
              <div className="line-clamp-4 text-2">{event?.location?.locationDetails}</div>
            </>
          )}
          {event.content && (
            <>
              <IconPencil />
              <div className="line-clamp-4 font-medium text-2">{event.content.text}</div>
            </>
          )}
        </div>
        <ActionButton
          action={{
            label: 'Voir les détails',
            linkOrActionOrMenu: EVENT_ROUTE(event?.slug),
          }}
        />
      </div>
    </div>
  );
}
