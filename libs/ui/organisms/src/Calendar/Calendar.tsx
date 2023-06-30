import { CalendarTopbar } from './CalendarTopbar';
import Month from './Month';

import { getMonthMatrix } from '@okampus/shared/utils';
import type { EventBaseInfo } from '@okampus/shared/graphql';

export type CalendarProps = {
  events: EventBaseInfo[];
  monthYear: [number, number];
  setMonthYear: (monthYear: [number, number]) => void;
  showInTopbar?: boolean;
};
export function Calendar({ events, monthYear, setMonthYear, showInTopbar }: CalendarProps) {
  return (
    <>
      <div className="h-full flex flex-col">
        <CalendarTopbar monthYear={monthYear} setMonthYear={setMonthYear} showInTopbar={showInTopbar} />
        <Month month={getMonthMatrix(...monthYear)} events={events} />
      </div>
    </>
  );
}
