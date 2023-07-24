'use client';

import HomeSideBar from '../../../components/layouts/SideBar/HomeSideBar';
import GroupItem from '../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../components/atoms/Layout/ViewLayout';
import EventCard from '../../../components/molecules/Card/EventCard';

import { useTypedQueryAndSubscribe } from '../../../hooks/apollo/useTypedQueryAndSubscribe';

import { EventState } from '@okampus/shared/enums';
import { eventWithJoinInfo, OrderBy } from '@okampus/shared/graphql';

import { useMemo } from 'react';

export default function HomePage() {
  const now = useMemo(() => new Date(), []);
  const nowString = now.toISOString();
  const welcomeHeader = `${now.getHours() > 7 && now.getHours() < 18 ? 'Bonjour' : 'Bonsoir'}`; //${me?.firstName}`;

  const where = { start: { _gte: nowString }, state: { _eq: EventState.Published } };
  const variables = { limit: 6, where, orderBy: [{ start: OrderBy.ASC }] };

  const { data } = useTypedQueryAndSubscribe({ queryName: 'event', selector: [variables, eventWithJoinInfo] });

  return (
    <>
      <HomeSideBar />
      <ViewLayout header={welcomeHeader} bottomPadded={false}>
        <GroupItem
          heading="Les derniers événements"
          groupClassName="mt-2 w-full grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-8"
        >
          {data?.event?.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </GroupItem>
      </ViewLayout>
    </>
  );
}
