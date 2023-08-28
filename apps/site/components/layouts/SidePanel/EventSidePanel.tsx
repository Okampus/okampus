'use client';

import SidePanel from '../SidePanel';
import GroupItem from '../../atoms/Item/GroupItem';
import UserLabeled from '../../molecules/Labeled/UserLabeled';

import { useEvent } from '../../../context/navigation';

import Link from 'next/link';

const labeledClassName = 'bg-2-hover rounded-lg p-2 w-full';

export type EventSidePanelProps = { slug: string };
export default function EventSidePanel({ slug }: EventSidePanelProps) {
  const { event } = useEvent(slug);
  if (!event?.eventJoinsAggregate.aggregate) return null;

  const count = event.eventJoinsAggregate.aggregate.count;

  const supervisors = event.eventOrganizes.flatMap(({ eventSupervisors, team }) =>
    eventSupervisors.map(({ user }) => [user, team] as const),
  );

  return (
    <SidePanel>
      <GroupItem
        className="my-[var(--py-content)] px-3"
        headingClassName="px-2"
        groupClassName="flex flex-col"
        heading={`Responsables — ${supervisors.length}`}
      >
        {supervisors.map(([user, team]) => (
          <UserLabeled key={user.id} user={user} full={true} className={labeledClassName} content={team.actor.name} />
        ))}
      </GroupItem>
      <GroupItem
        className="mb-4 px-3"
        headingClassName="px-2"
        groupClassName="flex flex-col"
        heading={`Inscrits — ${count}`}
      >
        {event.eventJoins.map(({ joinedBy }) => (
          <UserLabeled key={joinedBy.id} user={joinedBy} full={true} className={labeledClassName} />
        ))}
        {count > 12 && (
          <Link key="all" href={`/event/${slug}/joins`} className="more-button px-3 py-4">
            Voir tous les inscrits
          </Link>
        )}
      </GroupItem>
      {/* <TeamLabeled key={idx} team={eventManage.team} full={true} className="bg-2-hover rounded-lg p-2 w-full" /> */}
      {/* <div className="page-subtitle pb-4 mt-4 px-2">{event.eventJoinsAggregate.aggregate?.count} Inscrits</div>
      {event.eventJoins.slice(0, 10).map((eventJoin) => (
        <div key={eventJoin.id}>
          <UserLabeled user={eventJoin.joinedBy} full={true} className="bg-2-hover rounded-lg p-2 w-full" />
        </div>
      ))} */}
      {/* <Profile type="event" actor={event.actor} socials={event.actor.socials} /> */}
    </SidePanel>
  );
}
