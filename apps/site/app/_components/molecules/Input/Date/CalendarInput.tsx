import SelectInput from '../Select/SelectInput';

import { useTranslation } from '../../../../_hooks/context/useTranslation';

import { getCalendar, range } from '@okampus/shared/utils';
import { WEEKDAYS_SHORT } from '@okampus/shared/consts';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr';

const years = range({ from: 1970, to: 2050 }).map((year) => ({ value: year, label: year.toString() }));

export type CalendarInputProps = {
  className?: string;
  disableSelect?: boolean;
  date: Date;
  setDate: (date: Date) => void;
};

function dayClass(day: number, date: Date, rowIdx: number) {
  const isOtherMonth = (rowIdx === 0 && day > 20) || (rowIdx > 3 && day < 15);
  if (isOtherMonth) return 'bg-3-hover text-3 opacity-50';
  if (date.getDate() === day) return 'bg-[var(--info)] text-white';
  return 'bg-3-hover text-1';
}

type MonthYear = [number, number];
export default function CalendarInput({ className, date, setDate, disableSelect }: CalendarInputProps) {
  const { format } = useTranslation();

  const months = range({ to: 12 }).map((value) => ({ value, label: format('month', new Date(0, value, 1)) }));

  const [monthYear, setMonthYear] = useState<MonthYear>([date.getMonth(), date.getFullYear()]);
  const monthMatrix = getCalendar(...monthYear);

  useEffect(() => {
    if (date.getMonth() === monthYear[0] && date.getFullYear() === monthYear[1]) return;
    setMonthYear([date.getMonth(), date.getFullYear()]);
  }, [date, monthYear]);

  const [month, year] = monthYear;
  const previousMonthYear: MonthYear = month === 0 ? [11, year - 1] : [month - 1, year];
  const nextMonthYear: MonthYear = month === 11 ? [0, year + 1] : [month + 1, year];

  const buttonClassName =
    'rounded-full cursor-pointer p-1 shrink-0 text-1 opacity-80 hover:opacity-100 hover:bg-[var(--bg-3)]';
  const buttonSmClassName = clsx(buttonClassName, 'h-7 w-7');

  return (
    <div className={clsx('flex flex-col w-fit text-1', className)}>
      <header className="flex justify-between items-center px-1 h-10">
        <span className="flex gap-3 text-lg text-0 font-semibold capitalize">
          {disableSelect ? (
            <>
              <span>{months[month].label} </span>
              <span>{year}</span>
            </>
          ) : (
            <>
              <SelectInput
                triggerClassName="py-2 pl-1 text-base"
                name="month"
                options={months}
                value={month}
                showIcon={false}
                onChange={(value) => setDate(new Date(year, value, date.getDate()))}
              />
              <SelectInput
                name="year"
                placement="bottom"
                triggerClassName="py-2 text-base"
                contentClassName="grid grid-cols-4 p-2"
                itemClassName="flex items-center justify-center"
                options={years}
                value={year}
                showIcon={false}
                onChange={(value) => setDate(new Date(value, month, date.getDate()))}
              />
            </>
          )}
        </span>
        <div className="flex items-center">
          <CaretLeft
            className={buttonSmClassName}
            onClick={() => setDate(new Date(previousMonthYear[1], previousMonthYear[0], date.getDate()))}
          />
          <CaretRight
            className={buttonSmClassName}
            onClick={() => setDate(new Date(nextMonthYear[1], nextMonthYear[0], date.getDate()))}
          />
        </div>
      </header>
      <div className="flex flex-col mx-auto">
        <div className="flex">
          {WEEKDAYS_SHORT.map((day) => (
            <span key={day} className="flex text-sm items-center justify-center text-2 font-medium h-9 w-9">
              {day}
            </span>
          ))}
        </div>
        {monthMatrix.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((day, idx) => {
              const [month, year] =
                rowIdx > 3 && day < 15 ? nextMonthYear : rowIdx === 0 && day > 20 ? previousMonthYear : monthYear;
              return (
                <button
                  key={idx}
                  onClick={() => setDate(new Date(year, month, day))}
                  className={clsx(
                    dayClass(day, date, rowIdx),
                    'text-[0.925rem] text-center w-9 h-9 font-medium rounded-full',
                  )}
                >
                  {day.toString().padStart(2, '0')}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
