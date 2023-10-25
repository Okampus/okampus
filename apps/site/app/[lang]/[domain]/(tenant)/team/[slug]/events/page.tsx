'use client';

import EmptyStateImage from '../../../../../../_components/atoms/Image/EmptyStateImage';
import ViewLayout from '../../../../../../_components/atoms/Layout/ViewLayout';
import EventCard from '../../../../../../_components/molecules/Card/EventCard';
import GridLayout from '../../../../../../_components/atoms/Layout/GridLayout';
import ContentLayout from '../../../../../../_components/layouts/ContentLayout';

import { useQueryAndSubscribe } from '../../../../../../_hooks/apollo/useQueryAndSubscribe';

import { ReactComponent as EventsEmptyState } from '@okampus/assets/svg/empty-state/events.svg';

import { GetEventsDocument, OrderBy } from '@okampus/shared/graphql';
import type { GetEventsQuery, GetEventsQueryVariables } from '@okampus/shared/graphql';

export default function TeamEventsPage({ params }: { params: { slug: string } }) {
  const variables = {
    where: { eventOrganizes: { team: { slug: { _eq: params.slug } } }, state: { _eq: 'Published' } },
    orderBy: [{ start: OrderBy.Asc }],
  };

  const { data, loading } = useQueryAndSubscribe<GetEventsQuery, GetEventsQueryVariables>({
    query: GetEventsDocument,
    variables,
  });

  const events = data?.event;

  return (
    <ViewLayout header="Événements">
      <ContentLayout
        data={events}
        loading={loading}
        emptyState={
          <EmptyStateImage
            image={<EventsEmptyState />}
            className="my-4 w-full"
            title="Aucun événement pour le moment"
            subtitle="Les prochains événements de l'équipe seront affichés ici."
          />
        }
        render={({ data }) => data.map((event) => <EventCard key={event.id} event={event} />)}
        innerWrapper={GridLayout}
      />
    </ViewLayout>
  );
}
