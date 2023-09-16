'use client';

import EventSidebar from './EventSidebar';
import EventView from './EventView';
import EventSidePanel from './EventSidePanel';

import { useEvent } from '../../../../../context/navigation';

export default function EventPage({ params }: { params: { slug: string } }) {
  const { event } = useEvent(params.slug);

  return (
    <>
      <EventSidebar event={event} />
      <EventView event={event} />
      <EventSidePanel event={event} />
    </>
  );
}
