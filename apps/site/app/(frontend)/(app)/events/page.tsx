'use client';

import Calendar from '../../../../components/organisms/Calendar';
import SideBar from '../../../../components/layouts/SideBar';
import CalendarDateInput from '../../../../components/molecules/Input/CalendarDateInput';
import { useTypedQueryAndSubscribe } from '../../../../hooks/apollo/useTypedQueryAndSubscribe';

import { EventState } from '@okampus/shared/enums';
import { OrderBy, eventBaseInfo } from '@okampus/shared/graphql';

import { useState } from 'react';

export default function EventsPage() {
  const [monthYear, setMonthYear] = useState<[number, number]>([new Date().getMonth(), new Date().getFullYear()]);
  const [sidebarDate, setSidebarDate] = useState<Date>(new Date());

  const _gte = new Date(monthYear[1], monthYear[0], 1).toISOString();
  const _lte = new Date(monthYear[1], monthYear[0] + 1, 0).toISOString();
  const where = { start: { _gte, _lte }, state: { _eq: EventState.Published } };

  const variables = { where, orderBy: [{ start: OrderBy.ASC }] };
  const { data } = useTypedQueryAndSubscribe({ queryName: 'event', selector: [variables, eventBaseInfo] });

  return (
    <>
      <SideBar>
        <CalendarDateInput
          className="w-full px-2 pt-[var(--py-content)]"
          date={sidebarDate}
          setDate={(date) => {
            setSidebarDate(date);
            setMonthYear([date.getMonth(), date.getFullYear()]);
          }}
        />
      </SideBar>
      <Calendar showInTopbar={true} events={data?.event ?? []} monthYear={monthYear} setMonthYear={setMonthYear} />
    </>
  );
}
