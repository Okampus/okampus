import { ITenantEvent } from '@okampus/shared/dtos';
import dayjs from 'dayjs';
import React from 'react';
import { Day } from './Day';

type MonthProps = {
  month: dayjs.Dayjs[][];
  events: ITenantEvent[];
};

export default function Month({ month, events }: MonthProps) {
  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-5">
      {month.map((row: dayjs.Dayjs[], i: number) => (
        <React.Fragment key={i}>
          {row.map((day: dayjs.Dayjs, idx: number) => (
            <Day
              events={events.filter((evt) => dayjs(evt.start).format('DD-MM-YY') === day.format('DD-MM-YY'))}
              day={day}
              key={idx}
              rowIdx={i}
              isRounded={i === 0 && idx === 6 ? 'top' : i === 4 && idx === 6 ? 'bottom' : undefined}
              isOtherMonth={(i === 0 && day.date() > 20) || (i === 4 && day.date() < 10)}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
