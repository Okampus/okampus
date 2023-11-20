'use client';

import Field from '../../Field';
import Popover from '../../../../atoms/Popover/Popover';
import PopoverTrigger from '../../../../atoms/Popover/PopoverTrigger';
import PopoverContent from '../../../../atoms/Popover/PopoverContent';

import { useOutsideClick } from '../../../../../_hooks/useOutsideClick';

import { range } from '@okampus/shared/utils';
import { Clock } from '@phosphor-icons/react';

import clsx from 'clsx';

import { useState, useRef, forwardRef, memo, useEffect } from 'react';
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

export type HourInputProps = UncontrolledInput<string>;

// TODO: Fix this component
export default memo(
  forwardRef<HTMLInputElement, HourInputProps>(function HourInput(props, ref) {
    const localRef = useRef<HTMLInputElement>();
    const [refs, isOpen, setIsOpen] = useOutsideClick(false);

    const {
      name,
      error,
      info,
      loading,
      className,
      label,
      disabled,
      required,
      defaultValue,
      description,
      ...inputProps
    } = props;

    const [dateISOString, setDateISOString] = useState(defaultValue ?? null);

    const currentHour = dateISOString?.slice(11, 13);
    const currentMinutes = dateISOString?.slice(14, 16);

    useEffect(() => {
      setTimeout(() => {
        const value = localRef.current?.value;
        if (value) setDateISOString(value);
      }, 200);
    }, [localRef]);

    useEffect(() => {
      if (props.defaultValue && localRef.current) {
        const date = props.defaultValue;
        localRef.current.value = date;
        setDateISOString(date);
      }
    }, [props.defaultValue, localRef]);

    const input = (
      <input
        ref={mergeRefs([ref, localRef])}
        type="time"
        name={name}
        disabled={disabled}
        // eslint-disable-next-line jsx-a11y/aria-props
        aria-description={description}
        aria-invalid={typeof error === 'string'}
        className={clsx('input w-full', error && '!outline !outline-1 !outline-[var(--danger)]')}
        onChange={(event) => setDateISOString(event.target.value)}
        {...inputProps}
      />
    );

    return (
      <Field {...{ label, className, name, description, required, info, error, loading }}>
        <div className="relative w-full">
          {input}
          <Popover forcePlacement={true} placement="bottom-start" controlledOpen={isOpen}>
            <PopoverTrigger
              onClick={() => !isOpen && setIsOpen(!isOpen)}
              className="absolute inset-y-1 right-1 px-2 bg-[var(--bg-main)]"
            >
              <Clock className="p-0.5" />
            </PopoverTrigger>
            <PopoverContent ref={(ref) => refs.current && (refs.current[0] = ref)} className="bg-1 rounded-md flex">
              <>
                <ul className="flex flex-col scrollbar overflow-y-scroll border-l border-[var(--border-2)] h-[20rem]">
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
                        if (localRef.current) {
                          localRef.current.value = (dateISOString ?? today().toISOString())
                            .replace(/(\d{4}-\d{2}-\d{2}T\d{2}):\d{2}/, `$1:${minute}`)
                            .slice(0, 16);
                          localRef.current.dispatchEvent(new Event('change'));
                          setDateISOString(localRef.current.value);
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
            </PopoverContent>
          </Popover>
        </div>
      </Field>
    );
  }),
);
