import GlobalContext from './GlobalContext';
import { getMonth } from './util';

import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';

import { ReactComponent as ChevronLeftIcon } from '@okampus/assets/svg/icons/material/outlined/next.svg';
import { ReactComponent as ChevronRightIcon } from '@okampus/assets/svg/icons/material/outlined/back.svg';

export function SmallCalendar() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIdx));
  }, [currentMonthIdx]);

  const {
    monthIndex,
    setSmallCalendarMonth,
    setSelectedDate: setSelectedDate,
    selectedDate: daySelected,
  } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonthIdx(monthIndex);
  }, [monthIndex]);

  function handlePrevMonth() {
    console.log('prev month');
    setCurrentMonthIdx(currentMonthIdx - 1);
  }
  function handleNextMonth() {
    console.log('next month');
    setCurrentMonthIdx(currentMonthIdx + 1);
  }
  function getDayClass(day: number) {
    const format = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });

    const nowDay = format.format(new Date());
    const currDay = format.format(day);

    const selectedDay = daySelected && format.format(daySelected.toDate());
    if (nowDay === currDay) {
      return 'bg-blue-500 rounded-full text-white';
    } else if (currDay === selectedDay) {
      return 'bg-blue-100 rounded-full text-blue-600 font-bold';
    } else {
      return 'text-0 rounded-full';
    }
  }
  return (
    <div>
      <header className="flex justify-between">
        <p className="text-2 font-bold">{dayjs(new Date(dayjs().year(), currentMonthIdx)).format('MMMM YYYY')}</p>
        <div>
          <button className="cursor-pointer text-2 mx-2" onClick={handlePrevMonth}>
            <ChevronLeftIcon />
          </button>
          <button className="cursor-pointer text-2 mx-2" onClick={handleNextMonth}>
            <ChevronRightIcon />
          </button>
        </div>
      </header>
      <div className="grid grid-cols-7 grid-rows-6">
        {currentMonth[0].map((day, i) => (
          <span key={i} className="text-sm py-1 text-center text-3">
            {day.format('dd').charAt(0)}
          </span>
        ))}
        {currentMonth.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSmallCalendarMonth(currentMonthIdx);
                  setSelectedDate(day);
                }}
                className={`py-1 w-full ${getDayClass(day.toDate().getDay())}`}
              >
                <span className="text-sm">{day.format('D')}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
