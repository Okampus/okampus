import { LabeledTeam } from '../Labeled/LabeledTeam';

import { EventState } from '@okampus/shared/enums';
import { formatDateRangeDayOfWeek } from '@okampus/shared/utils';
import { getAvatar } from '@okampus/ui/utils';

import { Link } from 'react-router-dom';

import type { EventManageBaseInfo } from '@okampus/shared/graphql';

type EventCardProps = {
  event: EventManageBaseInfo;
  link: string;
};

export function EventCard({ event, link }: EventCardProps) {
  const dateRange = formatDateRangeDayOfWeek(event.start as string, event.end as string);

  const team = event.teamEvents[0].team;
  return (
    <div className="w-[45rem] relative flex flex-col gap-2 border border-color-2 rounded-lg bg-2 py-2 px-4">
      <Link to={link} className="card-link" />
      <div className="flex items-start justify-between">
        <div>
          <div className="text-0">
            {event.name}
            <LabeledTeam id={team.id as string} name={team.actor?.name} avatar={getAvatar(team?.actor?.actorImages)} />
          </div>
          <div className="text-2">{dateRange}</div>
        </div>
        {event.state === EventState.Approved ? (
          <div className="rounded-lg bg-green-500 text-white py-0.5 px-2">Validé</div>
        ) : event.state === EventState.Published ? (
          <div className="rounded-lg bg-blue-500 text-white py-0.5 px-2">Publié</div>
        ) : event.state === EventState.Rejected ? (
          <div className="rounded-lg bg-red-400 text-white py-0.5 px-2">Refusé</div>
        ) : event.state === EventState.Submitted ? (
          <div className="rounded-lg bg-opposite text-opposite py-0.5 px-2">
            En attente de validation / {event.eventApprovalStep?.name ?? 'Validation initiale'}
          </div>
        ) : event.state === EventState.Draft ? (
          <div className="rounded-lg bg-yellow-500 text-white py-0.5 px-2">Brouillon</div>
        ) : null}
      </div>
    </div>
  );
}
