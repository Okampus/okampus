import CalendarHeader from './CalendarHeader';
import Sidebar from './Sidebar';
import Month from './Month';
import GlobalContext from './GlobalContext';
import EventModal from './EventModal';

import { getMonth } from './util';

import React, { useState, useContext, useEffect } from 'react';

import type { GraphQLTypes } from '@okampus/shared/graphql';

export function CalendarView({ events }: { events: GraphQLTypes['Event'][] }) {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal } = useContext(GlobalContext);
  // const { loading, error, data } = useQuery(getEventsQuery);

  // const filteredEvents = data?.events
  // data?.events?.edges
  //   .filter((event: { node: IEvent }) => event.node.state === EventState.Approved)
  //   ?.map((evt: { node: IEvent }) => evt.node) ?? [];

  useEffect(() => {
    console.log('monthIndex', monthIndex); // TODO: fix on route transition (avoid flicker)
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <React.Fragment>
      {showEventModal && <EventModal />}

      <div className="h-full flex flex-col">
        <CalendarHeader />
        <div className="flex flex-1 pb-4">
          <Sidebar />
          <Month month={currentMonth} events={events} />
        </div>
      </div>
    </React.Fragment>
  );
}
