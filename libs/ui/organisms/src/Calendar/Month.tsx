import { Day } from './Day';
import { WEEKDAYS_SHORT } from '@okampus/shared/consts';

import { Fragment } from 'react';
import type { Dayjs } from 'dayjs';
import type { EventBaseInfo } from '@okampus/shared/graphql';

const weekDayClassName = 'flex justify-center items-center text-2 font-medium py-4 text-2xl bg-2';

type MonthRowProps = { key: number; days: Dayjs[]; events: EventBaseInfo[]; currentMonth: number };
const MonthRow = ({ key, days, events, currentMonth }: MonthRowProps) => (
  <Fragment key={key}>
    {days.map((day, key) => {
      const eventsOnThatDay = events.filter((event) => day.isSame(event.start as string, 'day'));
      const isDayInCurrentMonth = day.month() === currentMonth;
      return <Day key={key} isOtherMonth={!isDayInCurrentMonth} events={eventsOnThatDay} day={day} />;
    })}
  </Fragment>
);

export type MonthProps = { month: Dayjs[][]; events: EventBaseInfo[] };
export default function Month({ month, events }: MonthProps) {
  const currentMonth = month[1][0].month(); // Get the month of the day in the middle of the month array
  const monthMatrixClassName = 'h-full w-full grid grid-cols-7 grid-rows-[auto_repeat(6,minmax(0,1fr))]';
  const weekDays = WEEKDAYS_SHORT.map((weekDay, idx) => (
    <div key={idx} className={weekDayClassName}>
      {weekDay}
    </div>
  ));

  return (
    <div className={monthMatrixClassName}>
      {weekDays}
      {month.map((days, idx) => (
        <MonthRow {...{ key: idx, days, events, currentMonth }} />
      ))}
    </div>
  );
}
