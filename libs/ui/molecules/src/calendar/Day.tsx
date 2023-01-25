import { ITenantEvent } from '@okampus/shared/dtos';
import { fuseClasses } from '@okampus/shared/utils';
import dayjs from 'dayjs';
// import React, { useContext, useState, useEffect } from 'react';
// import GlobalContext from './GlobalContext';
// import { EventType } from './types';

type DayProps = {
  day: dayjs.Dayjs;
  rowIdx: number;
  isRounded?: 'top' | 'bottom';
  isOtherMonth?: boolean;
  events: ITenantEvent[];
};

export function Day({ day, rowIdx, isRounded, isOtherMonth, events }: DayProps) {
  // const [dayEvents, setDayEvents] = useState<EventType[]>([]);
  // const { setSelectedDate, setShowEventModal, filteredEvents, setSelectedEvent } = useContext(GlobalContext);

  // useEffect(() => {
  //   const events = filteredEvents.filter((evt) => dayjs(evt.day).format('DD-MM-YY') === day.format('DD-MM-YY'));
  //   setDayEvents(events);
  // }, [filteredEvents, day]);

  function getCurrentDayClass() {
    return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
      ? 'bg-blue-600 text-white rounded-full w-7'
      : isOtherMonth
      ? 'text-3 rounded-full w-7'
      : 'text-1 rounded-full w-7';
  }
  return (
    <div
      className={fuseClasses(
        'border bc-1 flex flex-col',
        isRounded === 'top' ? 'rounded-tr-lg' : isRounded === 'bottom' ? 'rounded-br-lg' : ''
      )}
    >
      <header className="flex flex-col items-center">
        {rowIdx === 0 && <p className="text-sm mt-1 text-2">{day.format('ddd').toUpperCase()}</p>}
        <p className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}`}>{day.format('DD')}</p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          // setSelectedDate(day);
          // setShowEventModal(true);
        }}
      >
        {events.map((evt, idx) => (
          <div
            key={idx}
            // onClick={() => setSelectedEvent(evt)}
            className={`bg-orange-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
          >
            {evt.title}
          </div>
        ))}
      </div>
    </div>
  );
}
