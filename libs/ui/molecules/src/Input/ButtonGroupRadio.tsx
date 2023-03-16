import { clsx } from 'clsx';
import { useState } from 'react';
import type { SelectItem } from '@okampus/shared/types';

export type ButtonGroupRadioProps<T> = {
  items: SelectItem<T>[];
  onChange?: (value: T) => void;
};

export function ButtonGroupRadio<T>({ items, onChange }: ButtonGroupRadioProps<T>) {
  const [selected, setSelected] = useState(0);

  return (
    <div className={clsx('flex button-rounded bg-0')}>
      {items.map(({ label: element }, idx) => (
        <button
          key={idx}
          className={clsx(
            selected === idx ? 'bg-opposite text-opposite' : 'bg-0 text-0',
            'px-3 py-1.5 button-rounded font-heading font-semibold'
          )}
          onClick={() => {
            setSelected(idx);
            onChange?.(items[idx].value);
          }}
        >
          {element}
        </button>
      ))}
    </div>
  );
}
