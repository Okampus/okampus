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
        aria-description={description}
        aria-invalid={typeof error === 'string'}
        className={clsx('input pr-14', inputClassName)}
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
        <span className="relative w-full">
          {input}
          <Popover forcePlacement={true} placement="bottom-start" controlledOpen={isOpen}>
            <PopoverTrigger onClick={() => !isOpen && setIsOpen(!isOpen)} className={clsx(className, 'relative')}>
              {/* <div ref={setRefIndex(0, ref)} className="input !pt-1 pb-1 justify-between gap-4"> */}
              <IconCalendarEvent className="absolute inset-y-0 right-4" />
              {/* </div> */}
            </PopoverTrigger>
            <PopoverContent ref={(ref) => refs.current && (refs.current[0] = ref)} className="bg-1 p-5 rounded-md">
              <CalendarInput
                yearSelectRef={(ref) => refs.current && (refs.current[1] = ref)}
                monthSelectRef={(ref) => refs.current && (refs.current[2] = ref)}
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
        </span>
      </Field>
    );
  })
);

// const setRefIndex = (idx: number, ref: RefObject<(ValidRefTarget | null)[]>) => (el: HTMLElement | null) => {
//   if (ref.current) ref.current[idx] = el;
// };

// export type DateInputProps = { date: Date; onChange: (date: Date) => void; options: InputOptions; className?: string };
// export default function DateInput({ date, onChange, options, className }: DateInputProps) {
//   const [ref, isOpen, setIsOpen] = useOutsideClick(false);

//   const [dayString, setDayString] = useState(date.getDate().toString().padStart(2, '0'));
//   const [monthString, setMonthString] = useState((date.getMonth() + 1).toString().padStart(2, '0'));
//   const [yearString, setYearString] = useState(date.getFullYear().toString().padEnd(4, '0'));

//   console.log(date, date.getDate(), date.getMonth() + 1, date.getFullYear(), dayString, monthString, yearString);

//   return (
//     <Popover forcePlacement={true} placement="bottom-start" controlledOpen={isOpen}>
//       <PopoverTrigger onClick={() => !isOpen && setIsOpen(!isOpen)} className={clsx(className, 'relative')}>
//         {options.label && <div className="input-label selected !pr-12">{options.label}</div>}
//         <div ref={setRefIndex(0, ref)} className="input !pt-1 pb-1 justify-between gap-4">
//           {isOpen ? (
//             <div className="pt-5 flex gap-1 select-none">
//               <input
//                 value={dayString}
//                 onChange={(e) => setDayString(e.target.value)}
//                 className="w-6 bg-transparent text-center outline-none focus:bg-blue-400 [&::selection]:text-[var(--text-0)] caret-transparent"
//               />
//               <div>/</div>
//               <input
//                 value={monthString}
//                 onChange={(e) => setMonthString(e.target.value)}
//                 className="w-6 bg-transparent text-center outline-none focus:bg-blue-400 [&::selection]:text-[var(--text-0)] caret-transparent"
//               />
//               <div>/</div>
//               <input
//                 value={yearString}
//                 onChange={(e) => setYearString(e.target.value)}
//                 className="w-12 bg-transparent text-center outline-none focus:bg-blue-400 [&::selection]:text-[var(--text-0)] caret-transparent"
//               />
//             </div>
//           ) : (
//             <div className={clsx(options.label && 'pt-5 text-left line-clamp-1')}>
//               {date.toLocaleDateString('fr', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
//             </div>
//           )}
//           <IconCalendarEvent />
//         </div>
//       </PopoverTrigger>
//       <PopoverContent ref={setRefIndex(1, ref)} className="bg-1 p-5 rounded-md">
//         <CalendarInput
//           yearSelectRef={setRefIndex(2, ref)}
//           monthSelectRef={setRefIndex(3, ref)}
//           date={date}
//           setDate={(date) => (onChange(date), setIsOpen(false))}
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }
