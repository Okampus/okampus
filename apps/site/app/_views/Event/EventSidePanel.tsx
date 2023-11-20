'use client';

import Sidepanel from '../../_components/layouts/Sidepanel';
import UserLabeled from '../../_components/molecules/Labeled/UserLabeled';

import { ListColumn } from '../../_components/atoms/Container/ListColumn';
import type { EventDetails } from '../../../types/prisma/Event/event-details';

const labeledClassName = 'bg-2-hover rounded-lg p-2 w-full';

export type EventSidePanelProps = { event: EventDetails };
export default function EventSidePanel({ event }: EventSidePanelProps) {
  const supervisors = event.eventOrganizes.flatMap(({ eventSupervisors, team }) =>
    eventSupervisors.map(({ user }) => [user, team] as const),
  );

  return (
    <Sidepanel>
      <section className="px-3 py-5">
        <ListColumn
          title="Responsables"
          items={supervisors.map(([user, team]) => ({
            children: (
              <UserLabeled
                key={user.id}
                user={user}
                full={true}
                className={labeledClassName}
                content={team.actor.name}
              />
            ),
          }))}
        />
        <ListColumn
          title="Inscrits"
          items={event.eventJoins.map(({ joinedBy }) => ({
            children: <UserLabeled key={joinedBy.id} user={joinedBy} full={true} className={labeledClassName} />,
          }))}
          count={event._count.eventJoins}
          seeMore={{
            action: `/event/${event.slug}/supervisors`,
            children: 'Voir tous les responsables',
          }}
        />
      </section>
    </Sidepanel>
  );
}
