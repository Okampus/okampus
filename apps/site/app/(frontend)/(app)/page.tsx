'use client';

import EmptyStateImage from '../../../components/atoms/Image/EmptyStateImage';

import HomeSideBar from '../../../components/layouts/SideBar/HomeSideBar';
import GroupItem from '../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../components/atoms/Layout/ViewLayout';
import EventCard from '../../../components/molecules/Card/EventCard';

import { useMe } from '../../../context/navigation';
import { useQueryAndSubscribe } from '../../../hooks/apollo/useQueryAndSubscribe';

import { ReactComponent as MilestonesEmptyState } from '@okampus/assets/svg/empty-state/milestones.svg';
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
          <GroupItem
            heading="Les derniers événements"
            groupClassName="mt-2 w-full grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4"
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </GroupItem>
        ) : (
          !loading && (
            <EmptyStateImage
              className="mt-20"
              image={<MilestonesEmptyState />}
              title="Aucun événement à venir pour le moment"
              subtitle="Vous retrouverez les événements à venir sur la page d'accueil"
            />
          )
        )}
      </ViewLayout>
    </>
  );
}
