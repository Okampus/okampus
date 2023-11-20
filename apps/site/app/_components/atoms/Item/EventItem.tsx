import { getTranslation } from '../../../../server/ssr/getTranslation';
import { Ticket } from '@phosphor-icons/react/dist/ssr';

import type { EventMinimal } from '../../../../types/prisma/Event/event-minimal';

export type EventItemProps = { event: EventMinimal };
export async function EventItem({ event }: EventItemProps) {
  const { format } = await getTranslation();

  return (
    <div className="flex items-center gap-2">
      <Ticket className="w-8 h-8 shrink-0" />
      <div>
        <div>{format('weekDayLongHour', event.start)}</div>
        <div>{event.name}</div>
      </div>
    </div>
  );
}
