'use client';

import ViewLayout from '../../../../../../_components/atoms/Layout/ViewLayout';
import UserLabeled from '../../../../../../_components/molecules/Labeled/UserLabeled';

import { useEvent } from '../../../../../../_context/navigation';

import { ClockCounterClockwise } from '@phosphor-icons/react';

export default function EventJoinsPage({ params }: { params: { slug: string } }) {
  const { event } = useEvent(params.slug);

  if (!event) return null;

  return (
    <ViewLayout
      header={`Inscrits (${event.eventJoins.length})`}
      sidePanelIcon={<ClockCounterClockwise className="h-7 w-7" />}
    >
      <div className="flex flex-col gap-4">
        {event?.eventJoins.map(({ id, joinedBy }) => {
          return <UserLabeled key={id} user={joinedBy} />;
        })}
      </div>
    </ViewLayout>
  );
}
