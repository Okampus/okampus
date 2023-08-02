import BannerImage from '../../atoms/Image/BannerImage';
import { formatDateDayOfWeek } from '@okampus/shared/utils';
import type { EventBaseInfo } from '@okampus/shared/graphql';

export type EventLabeledProps = { event: EventBaseInfo };
export default function EventLabeled({ event }: EventLabeledProps) {
  const displayedStart = formatDateDayOfWeek(event.start).replaceAll('.,', ' · ');

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
