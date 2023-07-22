'use client';

import UserLabeled from '../../molecules/Labeled/UserLabeled';
import GroupItem from '../../atoms/Item/GroupItem';

import TeamLabeled from '../../molecules/Labeled/TeamLabeled';

import { useEvent } from '../../../context/navigation';
import SidePanel from '../SidePanel';

const labeledClassName = 'bg-2-hover rounded-lg p-2 w-full';

export type EventSidePanelProps = { slug: string };
export default function EventSidePanel({ slug }: EventSidePanelProps) {
  const { event } = useEvent(slug);
  if (!event) return null;

  return (
    <SidePanel>
      <div className="page-subtitle px-2 py-[var(--py-content)]">Organisé par</div>
      {event.eventOrganizes.map((eventManage) => (
        <div key={eventManage.team.id}>
          <TeamLabeled team={eventManage.team} full={true} className="bg-2-hover rounded-lg p-2 w-full" />
          <hr className="m-2 border-[var(--border-2)]" />
        </div>
      ))}
      <GroupItem
        className="mb-4"
        headingClassName="px-2"
        groupClassName="flex flex-col"
        heading={`Inscrits — ${event.eventJoinsAggregate.aggregate?.count}`}
      >
        {event.eventJoins.map(({ joinedBy: { id, individual } }) => (
          <UserLabeled key={id} id={id} individual={individual} full={true} className={labeledClassName} />
        ))}
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
