'use client';

import CalendarInput from './CalendarInput';

import Field from '../Field';
import Popover from '../../../atoms/Popup/Popover/Popover';
import PopoverTrigger from '../../../atoms/Popup/Popover/PopoverTrigger';
import PopoverContent from '../../../atoms/Popup/Popover/PopoverContent';
import { useTranslation } from '../../../../hooks/context/useTranslation';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';

import { range } from '@okampus/shared/utils';
import { IconCalendarEvent } from '@tabler/icons-react';

import clsx from 'clsx';
import { useState, createRef, forwardRef, memo, useEffect } from 'react';
import { mergeRefs } from 'react-merge-refs';

import type { UncontrolledInput } from '@okampus/shared/types';

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

const getDateISOString = (date: string) => {
  try {
    return new Date(date).toISOString().slice(0, 16);
  } catch {
    return null;
  }
};

export type DateInputProps = {
  inputClassName?: string;
  includeTime?: boolean;
} & UncontrolledInput<string> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type' | 'className' | 'defaultValue' | 'placeholder'>;

export default memo(
  forwardRef<HTMLInputElement, DateInputProps>(function DateInput(props, ref) {
    const localRef = createRef<HTMLInputElement>();
    const [refs, isOpen, setIsOpen] = useOutsideClick(false);

    const { format } = useTranslation();

    const {
      name,
      onChange,
      error,
      info: inputInfo,
      loading,
      className,
      label,
      disabled,
      required,
      defaultValue,
      description,
      inputClassName,
      includeTime,
      ...inputProps
    } = props;

    const [dateISOString, setDateISOString] = useState(defaultValue ? getDateISOString(defaultValue) : null);

    const currentHour = dateISOString?.slice(11, 13);
    const currentMinutes = dateISOString?.slice(14, 16);

    useEffect(() => {
      if (props.defaultValue && localRef.current) {
        localRef.current.value = props.defaultValue;
        setDateISOString(getDateISOString(props.defaultValue));
      }
    }, [props.defaultValue, localRef]);

    const input = (
      <input
        ref={mergeRefs([ref, localRef])}
        type={includeTime ? 'datetime-local' : 'date'}
        name={name}
        disabled={disabled}
        // eslint-disable-next-line jsx-a11y/aria-props
        aria-description={description}
        aria-invalid={typeof error === 'string'}
        className={clsx('input w-full', inputClassName, error && '!outline !outline-1 !outline-[var(--danger)]')}
        onChange={(event) => {
          onChange?.(event);
          setDateISOString(event.target.value);
        }}
        {...inputProps}
      />
    );

    const info = inputInfo ?? (dateISOString ? format('weekDay', dateWithoutTimezone(new Date(dateISOString))) : null);
    const fieldProps = { label, className, name, description, required, error, info, loading };

    return (
      <Field {...fieldProps}>
        <div className="relative w-full">
          {input}
          <Popover forcePlacement={true} placement="bottom-start" controlledOpen={isOpen}>
            <PopoverTrigger
              onClick={() => !isOpen && setIsOpen(!isOpen)}
              className="absolute top-0 bottom-0 right-2.5 bg-[var(--bg-input)]"
            >
              <IconCalendarEvent className="p-0.5" />
            </PopoverTrigger>
            <PopoverContent
              ref={(ref) => refs.current && (refs.current[0] = ref)}
              className={clsx('bg-1 rounded-md flex')}
            >
              <CalendarInput
                className="py-2 px-3"
                disableSelect={true}
                date={dateISOString ? new Date(dateISOString) : today()}
                setDate={(date) => {
                  date = dateWithoutTimezone(date);
                  if (localRef.current) {
                    const isoString = date.toISOString();
                    localRef.current.value = isoString
                      .replace(/(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}/, `$1T${currentHour ?? '00'}:${currentMinutes ?? '00'}`)
                      .slice(0, 16);

                    localRef.current.dispatchEvent(new Event('change'));
                    setDateISOString(localRef.current.value || null);
                  }
                  setIsOpen(false);
                }}
              />
              {
                <>
                  <ul className="flex flex-col scrollbar overflow-y-scroll border-l border-color-2 h-[24rem]">
                    {hours.map((hour) => (
                      <li
                        key={hour}
                        onClick={() => {
                          if (localRef.current) {
                            localRef.current.value = (dateISOString ?? today().toISOString())
                              .replace(/(\d{4}-\d{2}-\d{2})T\d{2}/, `$1T${hour}`)
                              .slice(0, 16);
                            localRef.current.dispatchEvent(new Event('change'));
                            setDateISOString(localRef.current.value);
                          }
                        }}
                        className={clsx(
                          'shrink-0 flex justify-center items-center w-16 h-10 font-medium cursor-pointer hover:bg-[var(--bg-2)]',
                          currentHour === hour ? 'bg-[var(--info)] text-white' : 'text-1',
                        )}
                      >
                        {hour}
                      </li>
                    ))}
                  </ul>
                  <ul className="flex flex-col scrollbar overflow-y-scroll border-l border-color-2 h-[24rem]">
                    {minutes.map((minute) => (
                      <li
                        key={minute}
                        onClick={() => {
                          if (localRef.current) {
                            localRef.current.value = (dateISOString ?? today().toISOString())
                              .replace(/(\d{4}-\d{2}-\d{2}T\d{2}):\d{2}/, `$1:${minute}`)
                              .slice(0, 16);
                            localRef.current.dispatchEvent(new Event('change'));
                            setDateISOString(localRef.current.value);
                          }
                        }}
                        className={clsx(
                          'shrink-0 flex justify-center items-center w-16 h-10 font-medium cursor-pointer hover:bg-[var(--bg-2)]',
                          currentMinutes === minute ? 'bg-[var(--info)] text-white' : 'text-1',
                        )}
                      >
                        {minute}
                      </li>
                    ))}
                  </ul>
                </>
              }
            </PopoverContent>
          </Popover>
        </div>
      </Field>
    );
  }),
);
