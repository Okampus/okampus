import { CalendarDateInput } from './CalendarDateInput';

import { ReactComponent as EventFilledIcon } from '@okampus/assets/svg/icons/material/filled/event-month.svg';
import { Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';
import { useOutsideClick } from '@okampus/ui/hooks';
import { clsx } from 'clsx';

import type { InputOptions } from '@okampus/shared/types';
import type { ValidRefTarget } from '@okampus/ui/hooks';
import type { RefObject } from 'react';

const setRefIndex = (idx: number, ref: RefObject<(ValidRefTarget | null)[]>) => (el: HTMLElement | null) => {
  if (ref.current) ref.current[idx] = el;
};

export type DateInputProps = { date: Date; onChange: (date: Date) => void; options: InputOptions; className?: string };
export function DateInput({ date, onChange, options, className }: DateInputProps) {
  const [ref, isOpen, setIsOpen] = useOutsideClick(false);

  return (
    <Popover forcePlacement={true} placement="bottom-start" controlledOpen={isOpen}>
      <PopoverTrigger onClick={() => setIsOpen(!isOpen)} className={clsx(className, 'relative')}>
        {options.label && <div className="input-label selected !pr-12">{options.label}</div>}
        <div ref={setRefIndex(0, ref)} className="input justify-between">
          <div className={clsx(options.label && 'pt-5 text-left line-clamp-1')}>
            {date.toLocaleDateString('fr', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
          <EventFilledIcon className="h-full pl-3 py-3" />
        </div>
      </PopoverTrigger>
      <PopoverContent ref={setRefIndex(1, ref)} className="bg-0 p-5">
        <CalendarDateInput
          yearSelectRef={setRefIndex(2, ref)}
          monthSelectRef={setRefIndex(3, ref)}
          date={date}
          setDate={(date) => (onChange(date), setIsOpen(false))}
        />
      </PopoverContent>
    </Popover>
  );

  // return options.label ? (
  //   <fieldset>
  //     <legend className="font-medium text-1 text-lg opacity-90 flex px-2.5 mb-2">{options.label}</legend>
  //     {input}
  //   </fieldset>
  // ) : (
  //   input
  // );
}
