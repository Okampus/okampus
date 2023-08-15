'use client';

import BannerImage from '../../atoms/Image/BannerImage';
import { useTranslation } from '../../../hooks/context/useTranslation';
import type { EventMinimalInfo } from '../../../types/features/event.info';

export type EventLabeledProps = { event: EventMinimalInfo };
export default function EventLabeled({ event }: EventLabeledProps) {
  const { format } = useTranslation();
  const displayedStart = format('weekDayHour', new Date(event.start));

  return (
    <div className="flex gap-4 items-start">
      <BannerImage name={event.name} src={event.banner?.url} className="h-24 rounded-2xl" />
      <div className="flex flex-col gap-1">
        <div className="text-primary font-semibold uppercase line-clamp-1 tabular-nums">{displayedStart}</div>
        <div className="text-lg font-bold text-0 line-clamp-2">{event.name}</div>
      </div>
    </div>
  );
}
