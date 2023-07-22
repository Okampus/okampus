import SelectInput from './SelectInput';
import ArrowButtonIcon from '../../atoms/Icon/ArrowButtonIcon';

import { capitalize, getMonthMatrix } from '@okampus/shared/utils';
import { WEEKDAYS_SHORT } from '@okampus/shared/consts';

import clsx from 'clsx';
import { useState } from 'react';

import type { Ref } from 'react';

const months = Array.from({ length: 12 }, (_, i) => i).map((i) => ({
  value: i,
  label: capitalize(new Date(0, i, 1).toLocaleString('fr', { month: 'long' })),
}));

// TODO: improve with year grid
const years = Array.from({ length: 26 }, (_, i) => i).map((i) => ({
  value: new Date().getFullYear() + i - 5,
  label: new Date().getFullYear() + i - 5,
}));

export type CalendarDateInputProps = {
  className?: string;
  date: Date;
  setDate: (date: Date) => void;
  monthSelectRef?: Ref<HTMLDivElement>;
  yearSelectRef?: Ref<HTMLDivElement>;
};

type MonthYear = [number, number];
export default function CalendarDateInput({
  className,
  date,
  setDate,
  monthSelectRef,
  yearSelectRef,
}: CalendarDateInputProps) {
  const [monthYear, setMonthYear] = useState<MonthYear>([date.getMonth(), date.getFullYear()]);
  const monthMatrix = getMonthMatrix(...monthYear);
  const currentMonth = monthMatrix[1][0].month();

  const [month, year] = monthYear;
  const previousMonthYear: MonthYear = month === 0 ? [11, year - 1] : [month - 1, year];
  const nextMonthYear: MonthYear = month === 11 ? [0, year + 1] : [month + 1, year];

  return (
    <div className={clsx('flex flex-col w-fit', className)}>
      <header className="flex justify-between items-center mb-2 px-1">
        <ArrowButtonIcon
          disabled={true}
          direction="left"
          onClick={() => setMonthYear(previousMonthYear)}
          sizeClassName="h-10"
        />
        <span className="flex gap-3 text-xl text-0 font-semibold capitalize">
          <SelectInput
            items={months}
            contentElementRef={monthSelectRef}
            className="p-1 border-b border-color-3"
            value={month}
            arrow={false}
            onChange={(value) => setMonthYear([value, year])}
            options={{ name: 'month' }}
          />
          <SelectInput
            items={years}
            contentElementRef={yearSelectRef}
            className="p-1 border-b border-color-3"
            value={year}
            arrow={false}
            onChange={(value) => setMonthYear([month, value])}
            options={{ name: 'year' }}
          />
          {/* <span>{new Date(monthYear[1], monthYear[0]).toLocaleString('fr', { month: 'long' })} </span>
          <span>{monthYear[1]}</span> */}
        </span>
        <ArrowButtonIcon
          disabled={true}
          direction="right"
          onClick={() => setMonthYear(nextMonthYear)}
          sizeClassName="h-10"
        />
      </header>
      <div className="flex flex-col mx-auto">
        <div className="flex">
          {WEEKDAYS_SHORT.map((day) => (
            <span key={day} className="flex items-center justify-center text-2 aspect-square h-10">
              {day}
            </span>
          ))}
        </div>
        {monthMatrix.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((day, idx) => {
              const dayClassName = clsx(
                day.isSame(date, 'day')
                  ? 'bg-blue-500 text-white'
                  : day.month() === currentMonth
                  ? 'bg-4-hover text-1'
                  : 'bg-3-hover text-3 opacity-50',
                'text-center aspect-square h-10 font-medium rounded-lg'
              );
              return (
                <button key={idx} onClick={() => setDate(day.toDate())} className={dayClassName}>
                  {day.format('D')}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
