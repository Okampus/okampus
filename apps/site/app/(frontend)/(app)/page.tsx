'use client';

import EmptyStateImage from '../../../components/atoms/Image/EmptyStateImage';

import HomeSideBar from '../../../components/layouts/SideBar/HomeSideBar';
import SimpleList from '../../../components/molecules/List/SimpleList';
import ViewLayout from '../../../components/atoms/Layout/ViewLayout';
import EventCard from '../../../components/molecules/Card/EventCard';

import { useMe } from '../../../context/navigation';
import { useQueryAndSubscribe } from '../../../hooks/apollo/useQueryAndSubscribe';

import { ReactComponent as EventsEmptyState } from '@okampus/assets/svg/empty-state/events.svg';
import { GetEventsDocument, OrderBy } from '@okampus/shared/graphql';
import { EventState } from '@okampus/shared/enums';

import { useMemo } from 'react';
import type { GetEventsQuery, GetEventsQueryVariables } from '@okampus/shared/graphql';

export default function HomePage() {
  const me = useMe();
  const now = useMemo(() => new Date(), []);
  const nowString = now.toISOString();
  const welcomeHeader = `${now.getHours() > 7 && now.getHours() < 18 ? 'Bonjour' : 'Bonsoir'} ${me.user.firstName} !`;

  const variables = {
    limit: 6,
    where: { start: { _gte: nowString }, state: { _eq: EventState.Published } },
    orderBy: [{ start: OrderBy.Asc }],
  };

  const { data, loading } = useQueryAndSubscribe<GetEventsQuery, GetEventsQueryVariables>({
    query: GetEventsDocument,
    variables,
  });

  const events = data?.event ?? [];

  return (
    <>
      <HomeSideBar />
      <ViewLayout header={welcomeHeader} sidePanelIcon={null}>
        {events.length > 0 ? (
          <SimpleList
            heading="Les derniers événements"
            groupClassName="mt-2 w-full grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-x-3 gap-y-8"
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </SimpleList>
        ) : (
          !loading && (
            <EmptyStateImage
              className="md:mt-10"
              image={<EventsEmptyState />}
              title="Aucun événement à venir"
              subtitle="Vous retrouverez les événements à venir sur la page d'accueil"
            />
          )
        )}
      </ViewLayout>
    </>
  );
}
