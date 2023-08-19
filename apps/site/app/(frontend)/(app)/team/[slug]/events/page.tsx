'use client';

import EmptyStateImage from '../../../../../../components/atoms/Image/EmptyStateImage';
import ViewLayout from '../../../../../../components/atoms/Layout/ViewLayout';
import EventCard from '../../../../../../components/molecules/Card/EventCard';

import { useQueryAndSubscribe } from '../../../../../../hooks/apollo/useQueryAndSubscribe';

import { ReactComponent as EventsEmptyState } from '@okampus/assets/svg/empty-state/events.svg';

import { GetEventsDocument, OrderBy } from '@okampus/shared/graphql';
import type { GetEventsQuery, GetEventsQueryVariables } from '@okampus/shared/graphql';

export default function TeamEventsPage({ params }: { params: { slug: string } }) {
  const variables = {
    where: { eventOrganizes: { team: { actor: { slug: { _eq: params.slug } } } }, state: { _eq: 'Published' } },
    orderBy: [{ start: OrderBy.Asc }],
  };

  const { data } = useQueryAndSubscribe<GetEventsQuery, GetEventsQueryVariables>({
    query: GetEventsDocument,
    variables,
  });

  if (!data) return null;

  const events = data.event;

  return (
    <ViewLayout header="Événements">
      {events.length > 0 ? (
        <div className="mt-2 w-full grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex w-full justify-center">
          <EmptyStateImage
            image={<EventsEmptyState />}
            className="my-4 w-full"
            title="Aucun événement pour le moment"
            subtitle="Les prochains événements de l'équipe seront affichés ici."
          />
        </div>
      )}
    </ViewLayout>
  );
}
