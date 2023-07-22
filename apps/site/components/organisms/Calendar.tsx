'use client';

import ArrowButtonIcon from '../atoms/Icon/ArrowButtonIcon';
import Popover from '../atoms/Popup/Popover/Popover';
import PopoverContent from '../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../atoms/Popup/Popover/PopoverTrigger';

// import ActionButton from '../molecules/Button/ActionButton';
import EventPopoverCard from '../molecules/PopoverCard/EventPopoverCard';
import { useCurrentBreakpoint } from '../../hooks/useCurrentBreakpoint';
import { useTranslation } from '../../hooks/context/useTranslation';

import { formatHourSimple, getColorHexFromData, getMonthMatrix } from '@okampus/shared/utils';
import { WEEKDAYS_SHORT } from '@okampus/shared/consts';
// import { ActionType } from '@okampus/shared/types';

import clsx from 'clsx';
// import dayjs from 'dayjs';
import { Fragment } from 'react';

import type { EventBaseInfo } from '@okampus/shared/graphql';
import type { Dayjs } from 'dayjs';

type DayProps = { day: Dayjs; className?: string; dayClass?: string; isOtherMonth?: boolean; events: EventBaseInfo[] };
export function Day({ day, className, dayClass, isOtherMonth, events }: DayProps) {
  const currentWindowSize = useCurrentBreakpoint();

  const dayNumberClass =
    'rounded-xl my-1 mx-2 self-end flex justify-center items-center font-semibold tabular-nums text-lg';

  return (
    <div
      className={clsx(className, isOtherMonth ? 'text-[var(--text-3)]' : 'text-1', 'flex flex-col', 'overflow-hidden')}
    >
      <header className={clsx(dayNumberClass, dayClass)}>{day.format('DD')}</header>
      <div className="cursor-pointer">
        {events.map((event, idx) => (
          <Popover placementOffset={10} key={idx}>
            <PopoverTrigger className="w-full">
              <div className="flex justify-between items-center gap-2 mx-0.5 px-1 py-px rounded-md hover:bg-[var(--bg-2)]">
                <div className="flex gap-2 items-center">
                  <div
                    className="h-2 w-2 rounded-[50%] shrink-0 md-max:hidden"
                    style={{ backgroundColor: getColorHexFromData(event?.name) }}
                  />
                  <div
                    className="md-max:px-1 py-px rounded font-semibold md:line-clamp-1 md-max:text-clip md-max:whitespace-nowrap text-md text-0 text-start break-all"
                    style={
                      currentWindowSize === 'mobile'
                        ? { backgroundColor: getColorHexFromData(event?.name), color: 'white' }
                        : {}
                    }
                  >
                    {event?.name}
                  </div>
                </div>
                <span className="md-max:hidden text-[var(--text-3)] font-semibold mr-1 tabular-nums text-xs">
                  {formatHourSimple(event.start as string)}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <EventPopoverCard event={event} />
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}

const weekDayClassName = 'text-xl text-1 font-medium text-right p-2 border-b border-color-5';

export type CalendarProps = {
  events: EventBaseInfo[];
  monthYear: [number, number];
  setMonthYear: (monthYear: [number, number]) => void;
  showInTopbar?: boolean;
};
export default function Calendar({ events, monthYear, setMonthYear }: CalendarProps) {
  const { format } = useTranslation();
  const [month, year] = monthYear;

  const previoumdonthYear = (month === 0 ? [11, year - 1] : [month - 1, year]) as [number, number];
  const nextMonthYear = (month === 11 ? [0, year + 1] : [month + 1, year]) as [number, number];

  const monthMatrix = getMonthMatrix(...monthYear);

  const currentMonthDate = new Date(year, month);
  const currentMonth = monthMatrix[1][0].month(); // Get the month of the day in the middle of the month array
  const monthMatrixClassName = 'grow min-h-0 w-full grid grid-cols-7 grid-rows-[auto_repeat(6,minmax(0,1fr))]';
  const weekDays = WEEKDAYS_SHORT.map((weekDay) => (
    <div key={weekDay} className={weekDayClassName}>
      {weekDay}
    </div>
  ));

  return (
    <div className="h-full w-full flex flex-col pt-[var(--py-content)]">
      <header className="flex items-center justify-between py-2 mb-4">
        <div className="flex items-center gap-4 xl-max:px-6">
          <div className="flex gap-4 opacity-80">
            <ArrowButtonIcon direction="left" onClick={() => setMonthYear(previoumdonthYear)} />
            <ArrowButtonIcon direction="right" onClick={() => setMonthYear(nextMonthYear)} />
          </div>

          <div className="text-4xl tracking-tighter flex gap-3 capitalize text-0">
            <b>{format('month', new Date(currentMonthDate))}</b> {year}
          </div>
        </div>

        {/* <ActionButton action={{ type: ActionType.Action, label: "Aujourd'hui", linkOrActionOrMenu }} /> */}
      </header>
      <div className={monthMatrixClassName}>
        {weekDays}
        {monthMatrix.map((days, rowIdx) => (
          <Fragment key={rowIdx}>
            {days.map((day, idx) => {
              const isDayInCurrentMonth = day.month() === currentMonth;
              const className = clsx(rowIdx === 0 ? '' : 'border-t', idx === 0 ? '' : 'border-l');

              return (
                <Day
                  key={idx}
                  className={clsx(className, 'border-[var(--border-light)]')}
                  isOtherMonth={!isDayInCurrentMonth}
                  events={events.filter((event) => day.isSame(event.start, 'day'))}
                  day={day}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
