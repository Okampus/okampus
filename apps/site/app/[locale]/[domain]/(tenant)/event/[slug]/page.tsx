import EventSidebar from '../../../../../_views/Event/EventSidebar';
import EventView from '../../../../../_views/Event/EventView';

import { eventDetails } from '../../../../../../types/prisma/Event/event-details';

import prisma from '../../../../../../database/prisma/db';

import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../params.type';

export default async function EventPage({ params }: DomainSlugParams) {
  const event = await prisma.event.findFirst({ where: { slug: params.slug }, select: eventDetails.select });
  if (!event) notFound();

  return (
    <>
      <EventSidebar event={event} />
      <EventView event={event} />
      {/* <EventSidePanel event={event} /> */}
    </>
  );
}
