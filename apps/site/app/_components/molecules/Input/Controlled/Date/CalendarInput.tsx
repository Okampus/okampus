'use client';

import SelectInput from '../Select/SelectInput';
import { useTranslation } from '../../../../../_hooks/context/useTranslation';

import { getCalendar, range } from '@okampus/shared/utils';

import clsx from 'clsx';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Fragment, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';

import type { ControlledInput } from '@okampus/shared/types';

const years = range({ from: 1970, to: 2050 }).map((year) => ({ value: year, label: year.toString() }));

export type CalendarInputProps = ControlledInput<Date> & { disableSelect?: boolean };

function dayClass(day: number, date: Date | undefined, rowIdx: number) {
  const isOtherMonth = (rowIdx === 0 && day > 20) || (rowIdx > 3 && day < 15);
  if (isOtherMonth) return 'bg-3-hover text-3 opacity-50';
  if (date && date.getDate() === day) return 'bg-[var(--info)] text-white';
  return 'bg-3-hover text-1';
}

type CalendarInnerProps = { props: CalendarInputProps; value: Date | undefined; onChange: (value: Date) => void };
function CalendarInner({ props, value, onChange }: CalendarInnerProps) {
  const { format, locale } = useTranslation();

  const weekDayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
  const months = useMemo(
    () => range({ to: 12 }).map((value) => ({ value, label: format('month', new Date(0, value, 1)) })),
    [],
  );

  const currentDate = useMemo(() => new Date(), []);
  const dateOrNow = value || currentDate;

  const [monthYear, setMonthYear] = useState<MonthYear>([dateOrNow.getMonth(), dateOrNow.getFullYear()]);

  const monthMatrix = getCalendar(...monthYear);

  const [month, year] = monthYear;
  const previousMonthYear: MonthYear = month === 0 ? [11, year - 1] : [month - 1, year];
  const nextMonthYear: MonthYear = month === 11 ? [0, year + 1] : [month + 1, year];

  function getMonthYear(day: number, rowIdx: number) {
    if (rowIdx === 0 && day > 20) return previousMonthYear;
    if (rowIdx > 3 && day < 15) return nextMonthYear;
    return monthYear;
  }

  const buttonClassName =
    'rounded-full cursor-pointer p-1 shrink-0 text-1 opacity-80 hover:opacity-100 hover:bg-[var(--bg-3)]';
  const buttonSmClassName = clsx(buttonClassName, 'h-7 w-7');

  return (
    <div className={clsx('flex flex-col w-fit text-1', props.className)}>
      <header className="flex justify-between items-center h-10">
        <span className="flex gap-1.5 pl-1 text-lg text-0 font-semibold capitalize">
          {props.disableSelect ? (
            <>
              <span>{months[month].label} </span>
              <span>{year}</span>
            </>
          ) : (
            <>
              <SelectInput
                triggerClassName="capitalize p-1 pl-1.5 text-base border border-[var(--border-1)] rounded-md line-clamp-1"
                itemClassName="capitalize flex items-center"
                name="month"
                placeholder="Mois"
                options={months}
                value={month}
                showIcon={false}
                onChange={(selected) => setMonthYear([selected, year])}
              />
              <SelectInput
                name="year"
                placeholder="Année"
                placement="bottom"
                triggerClassName="p-1 pl-1.5 text-base border border-[var(--border-1)] rounded-md line-clamp-1"
                contentClassName="grid grid-cols-4 p-2"
                itemClassName="flex items-center justify-center"
                options={years}
                value={year}
                showIcon={false}
                onChange={(selected) => setMonthYear([month, selected])}
              />
            </>
          )}
        </span>
        <div className="flex items-center">
          <CaretLeft className={buttonSmClassName} onClick={() => setMonthYear(previousMonthYear)} />
          <CaretRight className={buttonSmClassName} onClick={() => setMonthYear(nextMonthYear)} />
        </div>
      </header>
      <div className="grid gap-y-1 grid-cols-7 pt-2">
        {Array.from({ length: 7 }).map((_, idx) => (
          <span key={idx} className="flex items-center justify-center text-2 font-medium h-9 w-9">
            {weekDayFormatter.format(new Date(0, 0, idx + 1))}
          </span>
        ))}
        {monthMatrix.map((row, idx) => (
          <Fragment key={idx}>
            {row.map((day) => {
              const className = clsx(
                dayClass(day, value, idx),
                'flex items-center justify-center w-9 mx-0.5 h-9 font-medium rounded-full',
              );
              const [month, year] = getMonthYear(day, idx);

              return (
                <button key={day} onClick={() => onChange(new Date(year, month, day))}>
                  <div className={className}>{day.toString()}</div>
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

type MonthYear = [number, number];
export default function CalendarInput(props: CalendarInputProps) {
  if (props.control) {
    return (
      <Controller
        name={props.name}
        control={props.control}
        render={({ field }) => <CalendarInner value={field.value} onChange={field.onChange} props={props} />}
      />
    );
  }

  return <CalendarInner value={props.value} onChange={props.onChange} props={props} />;
}
