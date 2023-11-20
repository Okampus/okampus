import BaseView from '../../../../../../_components/templates/BaseView';
import UserLabeled from '../../../../../../_components/molecules/Labeled/UserLabeled';

import EventSidebar from '../../../../../../_views/Event/EventSidebar';
import EventSidePanel from '../../../../../../_views/Event/EventSidePanel';

import prisma from '../../../../../../../database/prisma/db';

import { eventDetails } from '../../../../../../../types/prisma/Event/event-details';

import { ClockCounterClockwise } from '@phosphor-icons/react/dist/ssr';

import type { DomainSlugParams } from '../../../../../../params.type';

// TODO: static params
export default async function EventJoinsPage({ params }: DomainSlugParams) {
  const event = await prisma.event.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: eventDetails.select,
  });

  if (!event) return null;

  return (
    <>
      <EventSidebar event={event} />
      <BaseView
        header={`Inscrits (${event.eventJoins.length})`}
        sidePanelButton={<ClockCounterClockwise className="h-7 w-7" />}
      >
        <div className="flex flex-col gap-4">
          {event?.eventJoins.map(({ id, joinedBy }) => {
            return <UserLabeled key={id} user={joinedBy} />;
          })}
        </div>
      </BaseView>
      <EventSidePanel event={event} />
    </>
  );
}
