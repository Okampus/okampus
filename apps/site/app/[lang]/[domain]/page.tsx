'use client';

import EmptyStateImage from '../../_components/atoms/Image/EmptyStateImage';

import ViewLayout from '../../_components/atoms/Layout/ViewLayout';
import ContentLayout from '../../_components/layouts/ContentLayout';
import HomeSideBar from '../../_components/layouts/SideBar/HomeSideBar';
import SimpleList from '../../_components/molecules/List/SimpleList';
import EventCard from '../../_components/molecules/Card/EventCard';

import { useMe } from '../../_context/navigation';
import { useQueryAndSubscribe } from '../../_hooks/apollo/useQueryAndSubscribe';

import { ReactComponent as EventsEmptyState } from '@okampus/assets/svg/empty-state/events.svg';
import { GetEventsDocument, OrderBy } from '@okampus/shared/graphql';
import { EventState } from '@okampus/shared/enums';

import { useMemo } from 'react';
import type { GetEventsQuery, GetEventsQueryVariables } from '@okampus/shared/graphql';

function DomainHomeGrid({ children }: { children: React.ReactNode }) {
  return (
    <SimpleList
      heading="Les derniers événements"
      groupClassName="mt-2 w-full grid grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] gap-x-3 gap-y-8"
    >
      {children}
    </SimpleList>
  );
}

export default function DomainHomePage() {
  const me = useMe();
  const now = useMemo(() => new Date(), []);
  const nowString = now.toISOString();
  const welcomeHeader = `${now.getHours() > 7 && now.getHours() < 18 ? 'Bonjour' : 'Bonsoir'} ${me.firstName} !`;

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
        <ContentLayout
          data={events}
          loading={loading}
          render={({ data }) => data.map((event) => <EventCard key={event.id} event={event} />)}
          emptyState={
            <EmptyStateImage
              className="md:mt-10"
              image={<EventsEmptyState />}
              title="Aucun événement à venir"
              subtitle="Vous retrouverez les événements à venir sur la page d'accueil"
            />
          }
          innerWrapper={DomainHomeGrid}
        />
      </ViewLayout>
    </>
  );
}