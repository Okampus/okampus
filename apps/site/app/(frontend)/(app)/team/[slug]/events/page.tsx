'use client';

import ViewLayout from '../../../../../../components/atoms/Layout/ViewLayout';
import EventCard from '../../../../../../components/molecules/Card/EventCard';
import { useTeam } from '../../../../../../context/navigation';
import { useTypedQueryAndSubscribe } from '../../../../../../hooks/apollo/useTypedQueryAndSubscribe';

import { EventState } from '@okampus/shared/enums';
import { OrderBy, eventWithJoinInfo } from '@okampus/shared/graphql';

export default function TeamEventsPage({ params }: { params: { slug: string } }) {
  const { team } = useTeam(params.slug);

  const where = { eventOrganizes: { teamId: { _eq: team?.id } }, state: { _eq: EventState.Published } };
  const variables = { where, orderBy: [{ start: OrderBy.ASC }] };

  const { data } = useTypedQueryAndSubscribe({ queryName: 'event', selector: [variables, eventWithJoinInfo] });

  if (!team) return null;

  return (
    <ViewLayout header="Événements">
      <div className="mt-2 w-full grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-8">
        {data?.event?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </ViewLayout>
  );
}
