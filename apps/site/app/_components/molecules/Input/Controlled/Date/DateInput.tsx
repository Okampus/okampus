'use client';

import CalendarInput from './CalendarInput';

import Field from '../../Field';
import Popover from '../../../../atoms/Popover/Popover';
import PopoverTrigger from '../../../../atoms/Popover/PopoverTrigger';
import PopoverContent from '../../../../atoms/Popover/PopoverContent';

import { useOutsideClick } from '../../../../../_hooks/useOutsideClick';
import { dateFormatters } from '../../../../../../utils/format/format';

import { range } from '@okampus/shared/utils';
import { CalendarBlank } from '@phosphor-icons/react';

import clsx from 'clsx';
import { useFormatter } from 'next-intl';

import { useState, forwardRef, memo } from 'react';
import { Controller } from 'react-hook-form';

import type { ControlledInput } from '@okampus/shared/types';

const hours = range({ to: 24 }).map((hour) => hour.toString().padStart(2, '0'));
const minutes = range({ to: 60, step: 5 }).map((minutes) => minutes.toString().padStart(2, '0'));

const dateWithoutTimezone = (date: Date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
};

const today = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return dateWithoutTimezone(date);
};

const getDateFromString = (dateString?: string) => {
  const date = dateString ? new Date(dateString) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  return date;
};

export type DateInputProps = { includeTime?: boolean } & ControlledInput<string>;

type DateInputInnerProps = { props: DateInputProps; value: string | undefined; onChange: (value: string) => void };
function DateInputInner({ value, onChange, props }: DateInputInnerProps) {
  const [refs, isOpen, setIsOpen] = useOutsideClick(false);

  const format = useFormatter();

  const {
    name,
    error,
    info: inputInfo,
    loading,
    className,
    label,
    disabled,
    required,
    description,
    includeTime,
    placeholder,
  } = props;

  const [date, setDate] = useState<Date | null>(getDateFromString(value));

  const currentDate = date?.toISOString().slice(0, 10);
  const currentHour = date?.toISOString().slice(11, 13);
  const currentMinutes = date?.toISOString().slice(14, 16);

  const input = (
    <input
      type={includeTime ? 'datetime-local' : 'date'}
      name={name}
      disabled={disabled}
      value={currentDate}
      // eslint-disable-next-line jsx-a11y/aria-props
      aria-description={description}
      aria-invalid={typeof error === 'string'}
      className={clsx('input w-full', error && '!outline !outline-1 !outline-[var(--danger)]')}
      onChange={(event) => {
        setDate(getDateFromString(event.target.value));
        onChange(event.target.value);
      }}
      placeholder={placeholder}
    />
  );

  const info = inputInfo ?? (date ? format.dateTime(date, dateFormatters[includeTime ? 'dayHour' : 'day']) : null);

  return (
    <Field {...{ label, className, name, description, required, error, info, loading }}>
      <div className="relative w-full">
        {input}
        <Popover forcePlacement={true} placement="bottom-start" controlledOpen={isOpen}>
          <PopoverTrigger
            onClick={() => !disabled && setIsOpen((isOpen) => !isOpen)}
            className="absolute inset-y-1 right-1 px-2 bg-[var(--bg-main)]"
          >
            <CalendarBlank className={clsx('p-0.5 w-7 h-7', disabled && 'opacity-50')} />
          </PopoverTrigger>
          <PopoverContent
            ref={(ref) => refs.current && (refs.current[0] = ref)}
            className="bg-[var(--bg-main)] border border-[var(--border-1)] shadow-xl flex rounded-md"
          >
            <CalendarInput
              className="py-2 px-3"
              value={date ?? today()}
              onChange={(date) => {
                date = dateWithoutTimezone(date);
                onChange(date.toISOString());
                setDate(date);
                setIsOpen(false);
              }}
            />
            {props.includeTime && (
              <>
                <ul className="flex flex-col scrollbar overflow-y-scroll border-l border-[var(--border-2)] h-[20rem]">
                  {hours.map((hour) => (
                    <li
                      key={hour}
                      onClick={() => {
                        if (date) {
                          date.setHours(Number.parseInt(hour));
                          onChange(date.toISOString());
                          setDate(date);
                        }
                      }}
                      className={clsx(
                        'shrink-0 flex justify-center items-center w-16 h-10 font-medium cursor-pointer',
                        currentHour === hour ? 'bg-[var(--info)] text-white' : 'text-1 hover:bg-[var(--bg-2)]',
                      )}
                    >
                      {hour}
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-col scrollbar overflow-y-scroll border-l border-[var(--border-2)] h-[20rem]">
                  {minutes.map((minute) => (
                    <li
                      key={minute}
                      onClick={() => {
                        if (date) {
                          date.setMinutes(Number.parseInt(minute));
                          onChange(date.toISOString());
                          setDate(date);
                        }
                      }}
                      className={clsx(
                        'shrink-0 flex justify-center items-center w-16 h-10 font-medium cursor-pointer',
                        currentMinutes === minute ? 'bg-[var(--info)] text-white' : 'text-1 hover:bg-[var(--bg-2)]',
                      )}
                    >
                      {minute}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </Field>
  );
}

export default memo(
  forwardRef<HTMLInputElement, DateInputProps>(function DateInput(props, ref) {
    if (props.control) {
      return (
        <Controller
          name={props.name}
          control={props.control}
          render={({ field }) => <DateInputInner value={field.value} onChange={field.onChange} props={props} />}
        />
      );
    }

    return <DateInputInner value={props.value} onChange={props.onChange} props={props} />;
  }),
);
