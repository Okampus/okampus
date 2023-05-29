import { ReactComponent as SearchFilledIcon } from '@okampus/assets/svg/icons/material/filled/search.svg';

import { Popover, PopoverTrigger, PopoverContent } from '@okampus/ui/atoms';
import { useOutsideClick } from '@okampus/ui/hooks';
import clsx from 'clsx';
import type { SelectItem } from '@okampus/shared/types';

// function debounce(func: () =>, timeout = 300){
//   let timer;
//   return (...args) => {
//     if (!timer) {
//       func.apply(this, args);
//     }
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       timer = undefined;
//     }, timeout);
//   };
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(cb: T, wait = 20) {
  let h: number | NodeJS.Timeout = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callable = (...args: any[]) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };
  return callable;
}

export type MultiSelectInputProps<T> = {
  value: SelectItem<T> | null;
  onChange: (value: T) => void;
  items: SelectItem<T>[];
  onType?: (value: string) => void;
  className?: string;
  debounceTimeout?: number;
  loading?: boolean;
};

export function MultiSelectInput<T>({
  value,
  onChange,
  items,
  onType,
  className = 'input',
  debounceTimeout,
  loading,
}: MultiSelectInputProps<T>) {
  const [ref, isOpen, setIsOpen] = useOutsideClick(false);

  return (
    <Popover forcePlacement={true} placement="bottom-start" controlledOpen={isOpen}>
      <PopoverTrigger onClick={() => setIsOpen(!isOpen)}>
        <div ref={(el) => ref.current && (ref.current[0] = el)} className={clsx(className, 'justify-between')}>
          <SearchFilledIcon className="h-full py-3 pr-3" />
          {value?.label}
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-0 p-5">
        <div className="flex flex-col" ref={(el) => ref.current && (ref.current[1] = el)}>
          <input autoFocus className="input mb-5" placeholder="Rechercher" />
          <div className="flex flex-col">
            {items.map((item, idx) => (
              <button
                key={idx}
                className="flex items-center py-2.5 px-3.5 rounded-md text-0"
                onClick={() => (onChange(item.value), setIsOpen(false))}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
