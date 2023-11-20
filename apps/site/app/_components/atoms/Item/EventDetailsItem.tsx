import IAddress from '../Inline/IAddress';

import { getTranslation } from '../../../../server/ssr/getTranslation';

import { Ticket } from '@phosphor-icons/react/dist/ssr';

import clsx from 'clsx';
import Link from 'next/link';

import type { PrismaData } from '../../../../utils/prisma-serialize';
import type { EventMinimal } from '../../../../types/prisma/Event/event-minimal';

export type EventDetailsItemProps = { className?: string; event: PrismaData<EventMinimal> };
export async function EventDetailsItem({ className, event }: EventDetailsItemProps) {
  const { format } = await getTranslation();

  const remaining = event.maxParticipants ? event.maxParticipants - event._count.eventJoins : null;
  return (
    <div className={clsx('flex items-center gap-6', className)}>
      <Ticket className="w-10 h-10 shrink-0" />
      <div className="w-full">
        <Link href={`/event/${event.slug}`}>
          <div className="uppercase font-medium text-sm text-[var(--primary)]">
            {format('weekDayLongHour', event.start)}
          </div>
          <div className="font-medium text-0">{event.name}</div>
          {event?.address && <IAddress address={event.address} />}
        </Link>
        {/* <div className=inline text-[var(--text-2)] line-clamp-1">{event.description}</div> */}
        <div className="inline text-[var(--text-2)] mt-2">
          <Link href={`/event/${event.slug}/attendees`} className="hover:underline">
            {event._count.eventJoins} inscrits{' '}
          </Link>
          {remaining !== null && <span className="text-[var(--primary)]">• {remaining} places restantes</span>}
        </div>
      </div>
    </div>
  );
}
