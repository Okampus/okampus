'use client';

import Calendar from '../../../../components/organisms/Calendar';
import SideBar from '../../../../components/layouts/SideBar';
import CalendarInput from '../../../../components/molecules/Input/Date/CalendarInput';
import SideBarTitle from '../../../../components/layouts/SideBar/SidebarTitle';

import { useQueryAndSubscribe } from '../../../../hooks/apollo/useQueryAndSubscribe';

import { GetEventsDocument, OrderBy } from '@okampus/shared/graphql';
import { EventState } from '@okampus/shared/enums';

import { useState } from 'react';
import type { GetEventsQuery, GetEventsQueryVariables } from '@okampus/shared/graphql';

export default function EventsPage() {
  const [monthYear, setMonthYear] = useState<[number, number]>([new Date().getMonth(), new Date().getFullYear()]);
  const [sidebarDate, setSidebarDate] = useState<Date>(new Date());

  const _gte = new Date(monthYear[1], monthYear[0], 1).toISOString();
  const _lte = new Date(monthYear[1], monthYear[0] + 1, 0).toISOString();
  const where = { start: { _gte, _lte }, state: { _eq: EventState.Published } };

  const variables = { where, orderBy: [{ start: OrderBy.Asc }] };
  const { data } = useQueryAndSubscribe<GetEventsQuery, GetEventsQueryVariables>({
    query: GetEventsDocument,
    variables,
  });

  const events = data?.event ?? [];

  return (
    <>
      <SideBar>
        <SideBarTitle>Calendrier</SideBarTitle>
        <CalendarInput
          className="w-full px-2"
          date={sidebarDate}
          setDate={(date) => {
            setSidebarDate(date);
            setMonthYear([date.getMonth(), date.getFullYear()]);
          }}
        />
      </SideBar>
      <Calendar showInTopbar={true} events={events} monthYear={monthYear} setMonthYear={setMonthYear} />
    </>
  );
}
