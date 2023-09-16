'use client';

import SidePanel from '../../../../../components/layouts/SidePanel';
import SimpleList from '../../../../../components/molecules/List/SimpleList';
import UserLabeled from '../../../../../components/molecules/Labeled/UserLabeled';
import SkeletonSidepanel from '../../../../../components/atoms/Skeleton/SkeletonSidepanel';

import Link from 'next/link';

import type { EventInfo } from '../../../../../utils/apollo/fragments';

const labeledClassName = 'bg-2-hover rounded-lg p-2 w-full';

export type EventSidePanelProps = { event: EventInfo | null };
export default function EventSidePanel({ event }: EventSidePanelProps) {
  if (!event) return <SkeletonSidepanel />;

  const count = event.eventJoinsAggregate.aggregate?.count ?? event.eventJoins.length;

  const supervisors = event.eventOrganizes.flatMap(({ eventSupervisors, team }) =>
    eventSupervisors.map(({ teamMember: { user } }) => [user, team] as const),
  );

  return (
    <SidePanel>
      <SimpleList
        className="my-[var(--py-content)] px-3"
        headingClassName="px-2"
        groupClassName="flex flex-col"
        heading={`Responsables — ${supervisors.length}`}
      >
        {supervisors.map(([user, team]) => (
          <UserLabeled key={user.id} user={user} full={true} className={labeledClassName} content={team.actor.name} />
        ))}
      </SimpleList>
      <SimpleList
        className="mb-4 px-3"
        headingClassName="px-2"
        groupClassName="flex flex-col"
        heading={`Inscrits — ${count}`}
      >
        {event.eventJoins.map(({ joinedBy }) => (
          <UserLabeled key={joinedBy.id} user={joinedBy} full={true} className={labeledClassName} />
        ))}
        {count > event.eventJoins.length && (
          <Link key="all" href={`/event/${event.slug}/joins`} className="more-button px-3 py-4">
            Voir tous les inscrits
          </Link>
        )}
      </SimpleList>
    </SidePanel>
  );
}
