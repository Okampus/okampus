import { ReactComponent as CheckFilledIcon } from '@okampus/assets/svg/icons/material/filled/check-circle.svg';

import clsx from 'clsx';
import type { InputOptions, SelectItem } from '@okampus/shared/types';

export type SearchInputProps<T> = {
  items: SelectItem<T>[];
  query: string;
  onChangeQuery?: (value: string) => void;
  value: SelectItem<T> | null;
  onChangeValue: (value: SelectItem<T>) => void;
  options: InputOptions;
  className?: string;
};

export function SearchInput<T>({
  query,
  onChangeQuery,
  value,
  onChangeValue,
  items,
  options,
  className,
}: SearchInputProps<T>) {
  return (
    <fieldset className={clsx('border border-color-2 p-3 rounded', className)}>
      <legend className="text-2 opacity-90 text-base font-medium px-1">
        {options.label} {options.required && <div className="text-red-500">*</div>}
      </legend>
      <div className="flex flex-col gap-2">
        <input type="text" className="input" value={query} onChange={(e) => onChangeQuery?.(e.target.value)} />
        {value && (
          <div className="flex p-4 rounded text-0 bg-opposite text-opposite justify-between items-start gap-6">
            {value.label}
            <CheckFilledIcon className="shrink-0 text-green-400 h-7 w-7" />
          </div>
        )}
        {items
          .filter((item) => item.value !== value?.value)
          .map((item, idx) => (
            <div
              key={idx}
              className="text-left p-4 rounded text-0 bg-3 cursor-pointer opacity-80 hover:opacity-100 bg-4-hover"
              onClick={() => onChangeValue(item)}
            >
              {item.label}
            </div>
          ))}
      </div>
    </fieldset>
  );

  // const input = (
  //   <Popover forcePlacement={true} placement="bottom-start" controlledOpen={isOpen}>
  //     <PopoverTrigger onClick={() => setIsOpen(!isOpen)}>
  //       <div ref={(el) => ref.current && (ref.current[0] = el)} className={clsx(className, 'justify-between')}>
  //         <SearchFilledIcon className="h-full py-3 pr-3" />
  //         {value?.label}
  //       </div>
  //     </PopoverTrigger>
  //     <PopoverContent className="bg-0 p-5">
  //       <div className="flex flex-col" ref={(el) => ref.current && (ref.current[1] = el)}>
  //         <input
  //           autoFocus
  //           className="input mb-5"
  //           placeholder="Rechercher"
  //           onChange={(e) => {
  //             onTypeDebounced?.(e.target.value);
  //           }}
  //         />
  //         <div className="flex flex-col">
  //           {items.map((item, idx) => (
  //             <button
  //               key={idx}
  //               className="flex items-center py-2.5 px-3 rounded-md text-0"
  //               onClick={() => (onChange(item.value), setIsOpen(false))}
  //             >
  //               {item.label}
  //             </button>
  //           ))}
  //         </div>
  //       </div>
  //     </PopoverContent>
  //   </Popover>
  // );

  // return input;
}
