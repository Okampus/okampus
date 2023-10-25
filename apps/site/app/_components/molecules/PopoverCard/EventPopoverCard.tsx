import ActionButton from '../Button/ActionButton';
import TeamLabeled from '../Labeled/TeamLabeled';
import BannerImage from '../../atoms/Image/BannerImage';
import ILocation from '../../atoms/Inline/ILocation';
import Skeleton from '../../atoms/Skeleton/Skeleton';

import { useTranslation } from '../../../_hooks/context/useTranslation';

import { Article, MapPin, Pencil, Users } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import type { EventDetailsInfo } from '../../../../types/features/event.info';

export type EventPopoverCardProps = { event?: EventDetailsInfo };
export default function EventPopoverCard({ event }: EventPopoverCardProps) {
  const { format } = useTranslation();

  return event ? (
    <div className="text-0 relative bg-main shadow-lg dark:shadow-[#333] rounded-t-2xl md:rounded-2xl w-full md:w-[34rem]">
      {/* <CloseButtonIcon className="absolute right-4 top-4" onClick={onClose} /> */}
      <BannerImage className="rounded-t-2xl" name={event.name} aspectRatio={4.5} src={event.banner?.url} />
      <div className="px-10 py-8">
        <Link href={`/event/${event.slug}`} className="text-2xl font-semibold text-0">
          {event.name}
        </Link>
        <div className="text-primary font-semibold tabular-nums uppercase">
          {format('dayHourRange', [new Date(event.start), new Date(event.end)])}
        </div>
        <div className="grid grid-cols-[1.25rem_1fr] gap-4 my-8">
          <Users className="h-6 w-6 mt-1.5" />
          <div className="flex flex-wrap">
            {event.eventOrganizes.map((eventManage, index) => (
              <>
                <TeamLabeled team={eventManage.team} className="text-lg" />
                {index < event.eventOrganizes.length - 1 && <span className="mx-1">×</span>}
              </>
            ))}
          </div>
          <MapPin className="h-6 w-6" />
          {event.location && <ILocation location={event.location} />}
          {event?.locationDetails && (
            <>
              <Article />
              <div className="line-clamp-4 text-2">{event?.locationDetails}</div>
            </>
          )}
          {event.description && (
            <>
              <Pencil />
              <div className="line-clamp-4 text-2">{event.description}</div>
            </>
          )}
        </div>
        <ActionButton
          action={{
            label: 'Voir les détails',
            linkOrActionOrMenu: `/event/${event.slug}`,
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
        <hr className="my-1 border-[var(--border-3)]" />
        <Skeleton className="w-32 h-3" />
      </div>
    </div>
  );
}
