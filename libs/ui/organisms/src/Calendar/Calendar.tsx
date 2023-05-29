import { CalendarTopbar } from './CalendarTopbar';
import Month from './Month';
import EventModal from './EventModal';

import { useState } from 'react';
import { getMonthMatrix } from '@okampus/shared/utils';
import type { EventBaseInfo } from '@okampus/shared/graphql';

export type CalendarProps = {
  events: EventBaseInfo[];
  monthYear: [number, number];
  setMonthYear: (monthYear: [number, number]) => void;
  showInTopbar?: boolean;
};
export function Calendar({ events, monthYear, setMonthYear, showInTopbar }: CalendarProps) {
  // const [month, setMonth] = useState(monthYear[0]);
  // const [year, setYear] = useState(monthYear[1]);

  const [
    showEventModal,
    // setShowEventModal
  ] = useState(false);
  // useEffect(() => onMonthYearChange(monthYear), [month, year]);

  return (
    <>
      {showEventModal && <EventModal />}
      <div className="h-full flex flex-col">
        <CalendarTopbar monthYear={monthYear} setMonthYear={setMonthYear} showInTopbar={showInTopbar} />
        <Month month={getMonthMatrix(...monthYear)} events={events} />
      </div>
    </>
  );
}
