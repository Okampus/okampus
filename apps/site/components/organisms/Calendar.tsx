'use client';

import ArrowButtonIcon from '../atoms/Icon/ArrowButtonIcon';
import Popover from '../atoms/Popup/Popover/Popover';
import PopoverContent from '../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../atoms/Popup/Popover/PopoverTrigger';

import EventPopoverCard from '../molecules/PopoverCard/EventPopoverCard';
import { useCurrentBreakpoint } from '../../hooks/useCurrentBreakpoint';
import { useTranslation } from '../../hooks/context/useTranslation';

import ViewLayout from '../atoms/Layout/ViewLayout';
import { useGetEventLazyQuery } from '@okampus/shared/graphql';
import { getColorHexFromData, getCalendar } from '@okampus/shared/utils';
import { WEEKDAYS_SHORT } from '@okampus/shared/consts';

import clsx from 'clsx';
import { Fragment } from 'react';

import type { EventMinimalInfo } from '../../types/features/event.info';

const dayNumberClass =
  'rounded-xl my-1 mx-2 self-end flex justify-center items-center font-semibold tabular-nums text-lg md-max:text-xs';

type DayProps = {
  day: number;
  className?: string;
  dayClass?: string;
  isOtherMonth?: boolean;
  events: EventMinimalInfo[];
};
export function Day({ day, className, dayClass, isOtherMonth, events }: DayProps) {
  const currentWindowSize = useCurrentBreakpoint();

  const [getEvent, { data }] = useGetEventLazyQuery();
  const selectedEvent = data?.event?.[0];

  return (
    <div
      className={clsx(className, isOtherMonth ? 'text-[var(--text-3)]' : 'text-1', 'flex flex-col', 'overflow-hidden')}
    >
      <header className={clsx(dayNumberClass, dayClass)}>{day.toString().padStart(2, '0')}</header>
      <div className="cursor-pointer">
        {events.map((event, idx) => {
          const start = new Date(event.start);

          return (
            <Popover placementOffset={10} key={idx}>
              <PopoverTrigger className="w-full" onClick={() => getEvent({ variables: { slug: event.slug } })}>
                <div className="flex justify-between items-center gap-2 mx-0.5 px-1 py-px rounded-md hover:bg-[var(--bg-2)]">
                  <div className="flex gap-2 items-center">
                    <div
                      className="h-2 w-2 rounded-[50%] shrink-0 md-max:hidden"
                      style={{ backgroundColor: getColorHexFromData(event?.name) }}
                    />
                    <div
                      className="md-max:px-1 py-px rounded font-semibold md:line-clamp-1 md-max:text-clip md-max:whitespace-nowrap md-max:text-xs text-0 text-start break-all"
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
                    {start.getHours().toString().padStart(2, '0')}:{start.getMinutes().toString().padStart(2, '0')}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <EventPopoverCard event={selectedEvent} />
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </div>
  );
}

const weekDayClassName = 'text-xl text-1 font-medium text-right py-2 px-4 border-b border-color-5';

export type CalendarProps = {
  events: EventMinimalInfo[];
  monthYear: [number, number];
  setMonthYear: (monthYear: [number, number]) => void;
  showInTopbar?: boolean;
};
export default function Calendar({ events, monthYear, setMonthYear }: CalendarProps) {
  const { format } = useTranslation();
  const [month, year] = monthYear;

  const previoumdonthYear = (month === 0 ? [11, year - 1] : [month - 1, year]) as [number, number];
  const nextMonthYear = (month === 11 ? [0, year + 1] : [month + 1, year]) as [number, number];

  const monthMatrix = getCalendar(...monthYear);

  const currentMonthDate = new Date(year, month);
  const monthMatrixClassName = 'grow h-full w-full grid grid-cols-7 grid-rows-[auto_repeat(6,minmax(0,1fr))]';
  const weekDays = WEEKDAYS_SHORT.map((weekDay) => (
    <div key={weekDay} className={weekDayClassName}>
      {weekDay}
    </div>
  ));

  return (
    <ViewLayout
      bottomPadded={false}
      horizontalPadding={false}
      header={`${format('month', new Date(currentMonthDate))} ${year}`}
      headerPrefix={
        <div className="flex gap-4 opacity-80">
          <ArrowButtonIcon direction="left" onClick={() => setMonthYear(previoumdonthYear)} />
          <ArrowButtonIcon direction="right" onClick={() => setMonthYear(nextMonthYear)} />
        </div>
      }
      headerPrefixSmall={
        <div className="flex gap-1 opacity-80">
          <ArrowButtonIcon sizeClassName="h-7 w-7" direction="left" onClick={() => setMonthYear(previoumdonthYear)} />
          <ArrowButtonIcon sizeClassName="h-7 w-7" direction="right" onClick={() => setMonthYear(nextMonthYear)} />
        </div>
      }
      sidePanelIcon={null}
    >
      <div className={monthMatrixClassName}>
        {weekDays}
        {monthMatrix.map((days, rowIdx) => (
          <Fragment key={rowIdx}>
            {days.map((day, idx) => {
              const isOtherMonth = (rowIdx === 0 && day > 20) || (rowIdx > 3 && day < 15);
              const className = clsx(rowIdx === 0 ? '' : 'border-t', idx === 0 ? '' : 'border-l');

              return (
                <Day
                  key={idx}
                  className={clsx(className, 'border-[var(--border-light)]')}
                  isOtherMonth={isOtherMonth}
                  events={events.filter((event) => new Date(event.start).getDate() === day)}
                  day={day}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </ViewLayout>
  );
}
