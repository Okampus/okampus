'use client';

import BaseView from '../../_components/templates/BaseView';
import Popover from '../../_components/atoms/Popover/Popover';
import PopoverContent from '../../_components/atoms/Popover/PopoverContent';
import PopoverTrigger from '../../_components/atoms/Popover/PopoverTrigger';
// import EventPopoverCard from '../molecules/PopoverCard/EventPopoverCard';

import { useCurrentBreakpoint } from '../../_hooks/useCurrentBreakpoint';

// import { useGetEventLazyQuery } from '@okampus/shared/graphql';
import { dateFormatters } from '../../../utils/format/format';
import { getColorHexFromData, getCalendar } from '@okampus/shared/utils';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';

import clsx from 'clsx';
import { Fragment } from 'react';

import Link from 'next/link';
import { useFormatter, useLocale } from 'next-intl';

import type { EventMinimal } from '../../../types/prisma/Event/event-minimal';

const dayNumberClass =
  'rounded-xl my-1 mx-2 self-end flex justify-center items-center font-medium tabular-nums md-max:text-xs';

type DayProps = {
  day: number;
  className?: string;
  dayClass?: string;
  isOtherMonth?: boolean;
  events: EventMinimal[];
};

export function Day({ day, className, dayClass, isOtherMonth, events }: DayProps) {
  const currentWindowSize = useCurrentBreakpoint();

  // const [getEvent, { data }] = useGetEventLazyQuery();
  // const selectedEvent = data?.event?.[0];

  return (
    <div
      className={clsx(
        className,
        isOtherMonth ? 'text-[var(--text-3)]' : 'text-1',
        'flex flex-col',
        'overflow-hidden bg-[var(--bg-main)]',
      )}
    >
      <header className={clsx(dayNumberClass, dayClass)}>{day.toString().padStart(2, '0')}</header>
      <div className="cursor-pointer">
        {events.map((event) => {
          const start = new Date(event.start);

          // TODO: replace by event card
          return (
            <Popover placementOffset={10} key={event.id}>
              <PopoverTrigger
                className="w-full"
                onClick={
                  () => {}
                  // () => getEvent({ variables: { slug: event.slug } })
                }
              >
                <div className="flex justify-between items-center gap-2 mx-0.5 px-1 py-px rounded hover:bg-[var(--bg-2)]">
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
              <PopoverContent>{/* <EventPopoverCard event={selectedEvent} /> */}</PopoverContent>
            </Popover>
          );
        })}
      </div>
    </div>
  );
}

const weekDayClassName = 'text-sm md:text-xl text-1 font-medium text-right py-2 px-4 border-b border-[var(--border-5)]';
const buttonClassName =
  'rounded-full cursor-pointer p-1 shrink-0 text-1 opacity-80 hover:opacity-100 hover:bg-[var(--bg-3)]';

const buttonLgClassName = clsx(buttonClassName, 'h-10 w-10');
const buttonSmClassName = clsx(buttonClassName, 'h-7 w-7');

export type CalendarViewProps = { events: EventMinimal[]; monthYear: [number, number] };
export default function CalendarView({ events, monthYear }: CalendarViewProps) {
  const locale = useLocale();
  const format = useFormatter();
  const [month, year] = monthYear;

  const [previousMonth, previousYear] = (month === 1 ? [12, year - 1] : [month - 1, year]) as [number, number];
  const [nextMonth, nextYear] = (month === 12 ? [1, year + 1] : [month + 1, year]) as [number, number];

  const monthMatrix = getCalendar(...monthYear);

  const currentMonthDate = new Date(year, month - 1);
  const monthMatrixClassName = 'grow h-full w-full grid grid-cols-7 grid-rows-[auto_repeat(6,minmax(0,1fr))]';

  const weekDayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const weekDays = Array.from({ length: 7 }).map((_, idx) => (
    <span key={idx} className={weekDayClassName}>
      {weekDayFormatter.format(new Date(0, 0, idx + 1))}
    </span>
  ));

  const header = (
    <div className="flex gap-4 opacity-80">
      <Link href={`/calendar/${previousYear}/${previousMonth.toString().padStart(2, '0')}`}>
        <CaretLeft className={buttonLgClassName} />
      </Link>
      <Link href={`/calendar/${nextYear}/${nextMonth.toString().padStart(2, '0')}`}>
        <CaretRight className={buttonLgClassName} />
      </Link>
      <div className="ml-3 capitalize text-0">
        {format.dateTime(new Date(currentMonthDate), dateFormatters.month)} {year}
      </div>
    </div>
  );

  const headerSmall = (
    <div className="flex gap-1 opacity-80">
      <Link href={`/calendar/${previousYear}/${previousMonth.toString().padStart(2, '0')}`}>
        <CaretLeft className={buttonSmClassName} />
      </Link>
      <Link href={`/calendar/${nextYear}/${nextMonth.toString().padStart(2, '0')}`}>
        <CaretRight className={buttonSmClassName} />
      </Link>
      <div className="ml-3 capitalize text-0">
        {format.dateTime(new Date(currentMonthDate), dateFormatters.month)} {year}
      </div>
    </div>
  );

  return (
    <BaseView
      className="bg-1"
      innerClassName="h-full"
      header={header}
      headerSmall={headerSmall}
      sidePanelButton={null}
      unscrollable={true}
      paddingMode="none"
    >
      <div className={monthMatrixClassName}>
        {weekDays}
        {monthMatrix.map((days, rowIdx) => (
          <Fragment key={rowIdx}>
            {days.map((day, idx) => {
              const isOtherMonth = (rowIdx === 0 && day > 20) || (rowIdx > 3 && day < 15);
              const className = clsx(rowIdx !== 0 && 'border-t', idx !== 0 && 'border-l', 'border-[var(--border-1)]');
              const dayEvents = events.filter((event) => new Date(event.start).getDate() === day);

              return <Day key={idx} className={className} isOtherMonth={isOtherMonth} events={dayEvents} day={day} />;
            })}
          </Fragment>
        ))}
      </div>
    </BaseView>
  );
}
