import { fallbackLocale, getNextLang } from '../../../../server/ssr/getLang';
import { dateFormatters } from '../../../../utils/format/format';

import { Ticket } from '@phosphor-icons/react/dist/ssr';
import { getFormatter } from 'next-intl/server';

import type { EventMinimal } from '../../../../types/prisma/Event/event-minimal';

export type EventItemProps = { event: EventMinimal };
export async function EventItem({ event }: EventItemProps) {
  const format = await getFormatter({ locale: getNextLang() || fallbackLocale });

  return (
    <div className="flex items-center gap-2">
      <Ticket className="w-8 h-8 shrink-0" />
      <div>
        <div>{format.dateTime(event.start, dateFormatters.weekDayHour)}</div>
        <div>{event.name}</div>
      </div>
    </div>
  );
}
