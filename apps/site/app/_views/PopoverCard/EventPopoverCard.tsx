import Button from '../../_components/molecules/Button/Button';
import TeamLabeled from '../../_components/molecules/Labeled/TeamLabeled';
import BannerImage from '../../_components/atoms/Image/BannerImage';
import Skeleton from '../../_components/atoms/Skeleton/Skeleton';

import { dateFormatters, dateRangeFormatters } from '../../../utils/format/format';

import { Article, MapPin, Pencil, Users } from '@phosphor-icons/react/dist/ssr';
import { useFormatter, useLocale } from 'next-intl';
import Link from 'next/link';

import type { Locale } from '../../../server/ssr/getLang';
import type { EventDetails } from '../../../types/prisma/Event/event-details';

export type EventPopoverCardProps = { event?: EventDetails };
export default function EventPopoverCard({ event }: EventPopoverCardProps) {
  const locale = useLocale() as Locale;
  const format = useFormatter();

  return event ? (
    <div className="text-0 relative bg-main shadow-lg dark:shadow-[#333] rounded-t-2xl md:rounded-2xl w-full md:w-[34rem]">
      {/* <CloseButtonIcon className="absolute right-4 top-4" onClick={onClose} /> */}
      <BannerImage className="rounded-t-2xl" name={event.name} aspectRatio={4.5} src={event.banner} />
      <div className="px-10 py-8">
        <Link href={`/event/${event.slug}`} className="text-2xl font-semibold text-0">
          {event.name}
        </Link>
        <div className="text-primary font-semibold tabular-nums uppercase">
          {event.end
            ? dateRangeFormatters[locale].dayRange.formatRange(event.start, event.end)
            : format.dateTime(event.start, dateFormatters.weekDayHour)}
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
          {/* TODO: ILocation? */}
          {/* {event.location && <ILocation location={event.location} />} */}
          {event.locationDetails && (
            <>
              <Article />
              <div className="line-clamp-4 text-2">{event.locationDetails}</div>
            </>
          )}
          {event.description && (
            <>
              <Pencil />
              <div className="line-clamp-4 text-2">{event.description}</div>
            </>
          )}
        </div>
        <Button action={`/event/${event.slug}`}>Voir les détails</Button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col w-full md:w-80 rounded-lg overflow-hidden">
      <div className="h-24 bg-[var(--bg-main)]" />
      <div className="bg-1 text-0 p-4 relative flex flex-col gap-1">
        <Skeleton className="absolute -translate-y-[50%] rounded-[50%] h-14 w-14 border-4 border-[var(--bg-1)]" />
        <Skeleton className="-mt-4 h-6 w-64" />
        <hr className="my-1 border-[var(--border-3)]" />
        <Skeleton className="w-32 h-3" />
      </div>
    </div>
  );
}
