'use client';

import CalendarInput from './CalendarInput';

import Field from '../Field';
import Popover from '../../../atoms/Popup/Popover/Popover';
import PopoverTrigger from '../../../atoms/Popup/Popover/PopoverTrigger';
import PopoverContent from '../../../atoms/Popup/Popover/PopoverContent';
import { useTranslation } from '../../../../hooks/context/useTranslation';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';

import { IconCalendarEvent } from '@tabler/icons-react';

import clsx from 'clsx';
import { useState, createRef, forwardRef, memo, useEffect } from 'react';
import { mergeRefs } from 'react-merge-refs';

import type { UncontrolledInput } from '@okampus/shared/types';

export type DateInputProps = {
  inputClassName?: string;
} & UncontrolledInput<string> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type' | 'className' | 'defaultValue' | 'placeholder'>;

export default memo(
  forwardRef<HTMLInputElement, DateInputProps>(function DateInput(props, ref) {
    const localRef = createRef<HTMLInputElement>();
    const [refs, isOpen, setIsOpen] = useOutsideClick(false);

    const { format } = useTranslation();

    useEffect(() => {
      if (props.defaultValue && localRef.current) localRef.current.value = props.defaultValue;
    }, [props.defaultValue, localRef]);

    const {
      name,
      onChange,
      error,
      info,
      loading,
      className,
      label,
      disabled,
      required,
      defaultValue,
      description,
      inputClassName,
      ...inputProps
    } = props;

    const [date, setDate] = useState(defaultValue ? new Date(defaultValue) : null);

    const input = (
      <input
        ref={mergeRefs([ref, localRef])}
        type="date"
        name={name}
        disabled={disabled}
        // eslint-disable-next-line jsx-a11y/aria-props
        aria-description={description}
        aria-invalid={typeof error === 'string'}
        className={clsx('input w-full', inputClassName)}
        onChange={(event) => {
          setDate(event.target.valueAsDate);
          onChange?.(event);
        }}
        {...inputProps}
      />
    );

    const fieldProps = {
      label,
      className,
      name,
      description,
      required,
      error,
      info: info ?? (date ? format('weekDay', date) : null),
      loading,
    };
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
              className="bg-1 py-2 px-3 rounded-md"
            >
              <CalendarInput
                disableSelect={true}
                date={date ?? new Date()}
                setDate={(date) => {
                  if (localRef.current) {
                    localRef.current.valueAsDate = date;
                    localRef.current.dispatchEvent(new Event('change'));
                  }
                  setDate(date);
                  setIsOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </Field>
    );
  }),
);
