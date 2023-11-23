'use client';

import BannerImage from '../../atoms/Image/BannerImage';
import { dateFormatters } from '../../../../utils/format/format';
import { useFormatter } from 'next-intl';

import type { EventMinimal } from '../../../../types/prisma/Event/event-minimal';

export type EventLabeledProps = { event: EventMinimal };
export default function EventLabeled({ event }: EventLabeledProps) {
  const format = useFormatter();
  const displayedStart = format.dateTime(new Date(event.start), dateFormatters.weekDayHour);

  return (
    <div className="flex gap-4 items-start">
      <BannerImage name={event.name} src={event.banner} className="h-24 rounded-xl" />
      <div className="flex flex-col gap-1">
        <div className="text-primary font-semibold uppercase line-clamp-1 tabular-nums">{displayedStart}</div>
        <div className="text-lg font-bold text-0 line-clamp-2">{event.name}</div>
      </div>
    </div>
  );
}
