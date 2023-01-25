import { fuseClasses } from '@okampus/shared/utils';
import { useState } from 'react';

type SelectInputProps = {
  options: { value: string; render: () => JSX.Element }[];
  onChange?: (value: string) => void;
  onBlur?: () => void;
  firstValueSelected?: boolean;
};

export function SelectInput({ options, onChange, onBlur, firstValueSelected }: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(firstValueSelected ? options[0] : null);

  if (firstValueSelected) {
    onChange?.(options?.[0].value);
  }

  return (
    <div
      className={fuseClasses(
        'relative w-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-black',
        isOpen ? 'rounded-t-lg' : 'rounded-lg'
      )}
    >
      <div onClick={() => setIsOpen((isOpen) => !isOpen)}>{selected?.render() ?? 'Sélectionner...'}</div>
      {isOpen && (
        <div className="absolute left-0 top-[100%] w-full rounded-b-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black flex flex-col gap-2">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                setSelected(option);
                onChange?.(option.value);
                setIsOpen(false);
              }}
            >
              {option.render()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
