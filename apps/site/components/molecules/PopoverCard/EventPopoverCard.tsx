import ActionButton from '../Button/ActionButton';
import TeamLabeled from '../Labeled/TeamLabeled';
import BannerImage from '../../atoms/Image/BannerImage';
import ILocation from '../../atoms/Inline/ILocation';
import Skeleton from '../../atoms/Skeleton/Skeleton';

import { EVENT_ROUTE } from '@okampus/shared/consts';
import { formatDateRangeDayOfWeek } from '@okampus/shared/utils';

import { IconAlignLeft, IconLocation, IconPencil, IconUsers } from '@tabler/icons-react';
import Link from 'next/link';

import type { EventDetailsInfo } from '../../../types/features/event.info';

export type EventPopoverCardProps = { event?: EventDetailsInfo };
export default function EventPopoverCard({ event }: EventPopoverCardProps) {
  return event ? (
    <div className="text-0 relative bg-main shadow-lg dark:shadow-[#333] rounded-t-2xl md:rounded-2xl w-full md:w-[34rem]">
      {/* <CloseButtonIcon className="absolute right-4 top-4" onClick={onClose} /> */}
      <BannerImage className="rounded-t-2xl" name={event.name} aspectRatio={4.5} src={event?.banner?.url} />
      <div className="px-10 py-8">
        <Link href={EVENT_ROUTE(event?.slug)} className="text-2xl font-bold text-1">
          {event?.name}
        </Link>
        <div className="text-primary font-semibold tabular-nums capitalize">
          {formatDateRangeDayOfWeek(event.start, event.end)}
        </div>
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
          {event.location && <ILocation location={event.location} />}
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
  ) : (
    <div className="flex flex-col w-full md:w-80 rounded-lg overflow-hidden">
      <div className="h-24 bg-0" />
      <div className="bg-1 text-0 p-4 relative flex flex-col gap-1">
        <Skeleton className="absolute -translate-y-[50%] rounded-[50%] h-14 w-14 border-4 border-[var(--bg-1)]" />
        <Skeleton className="-mt-4 h-6 w-64" />
        <hr className="my-1 border-color-3" />
        <Skeleton className="w-32 h-3" />
      </div>
    </div>
  );
}
