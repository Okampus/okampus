import SelectInput from '../Select/SelectInput';
import ArrowButtonIcon from '../../../atoms/Icon/ArrowButtonIcon';

import { useTranslation } from '../../../../hooks/context/useTranslation';

import { getMonthMatrix, range } from '@okampus/shared/utils';
import { WEEKDAYS_SHORT } from '@okampus/shared/consts';

import clsx from 'clsx';
import { useState } from 'react';

// TODO: improve with year grid
const years = range({ from: 1970, to: 2050 }).map((year) => ({ value: year, label: year.toString() }));

export type CalendarInputProps = {
  className?: string;
  disableSelect?: boolean;
  date: Date;
  setDate: (date: Date) => void;
};

type MonthYear = [number, number];
export default function CalendarInput({ className, date, setDate, disableSelect }: CalendarInputProps) {
  const { format } = useTranslation();

  const months = Array.from({ length: 12 }, (_, i) => i).map((idx) => ({
    value: idx,
    label: format('month', new Date(0, idx, 1)),
  }));

  const [monthYear, setMonthYear] = useState<MonthYear>([date.getMonth(), date.getFullYear()]);
  const monthMatrix = getMonthMatrix(...monthYear);
  const currentMonth = monthMatrix[1][0].month();

  const [month, year] = monthYear;
  const previousMonthYear: MonthYear = month === 0 ? [11, year - 1] : [month - 1, year];
  const nextMonthYear: MonthYear = month === 11 ? [0, year + 1] : [month + 1, year];

  console.log('Month Year', month, year, months[month]);

  return (
    <div className={clsx('flex flex-col w-fit text-1', className)}>
      <header className="flex justify-between items-center mb-2 px-1">
        <ArrowButtonIcon
          disabled={true}
          direction="left"
          onClick={() => setMonthYear(previousMonthYear)}
          sizeClassName="h-10"
        />
        <span className="flex gap-3 text-lg text-0 font-semibold capitalize">
          {disableSelect ? (
            <>
              <span>{months[month].label} </span>
              <span>{year}</span>
            </>
          ) : (
            <>
              <SelectInput
                triggerClassName="py-2"
                name="month"
                options={months}
                value={month}
                showIcon={false}
                onChange={(value) => setMonthYear([value as number, year])}
              />
              <SelectInput
                name="year"
                placement="bottom"
                options={years}
                triggerClassName="py-2"
                contentClassName="grid grid-cols-4 bg-0 p-2"
                value={year}
                showIcon={false}
                onChange={(value) => setMonthYear([month, value as number])}
              />
            </>
          )}
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
                'text-center aspect-square h-10 font-medium rounded-lg',
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
