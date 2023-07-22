import RadioCircleIcon from '../../atoms/Icon/RadioCircleIcon';
import clsx from 'clsx';
import type { InputOptions, SelectItem } from '@okampus/shared/types';

export type RadioInputProps<T> = {
  items: SelectItem<T>[];
  selected: number | null;
  onChange: (value: number) => void;
  options: InputOptions;
};

export default function RadioInput<T>({ items, selected, onChange, options }: RadioInputProps<T>) {
  const radioClassName = 'flex gap-3 p-4 bg-3 rounded cursor-pointer';
  const radioGroup = (
    <div className="flex flex-col gap-1">
      {items.map(({ label }, idx) => {
        const onClick = () => onChange(idx);
        const className = clsx(radioClassName, idx !== selected && 'opacity-60 hover:opacity-100');
        return (
          <div key={idx} className={className} onClick={onClick}>
            <RadioCircleIcon checked={idx === selected} />
            <div className="text-1 font-medium text-lg">{label}</div>
          </div>
        );
      })}
    </div>
  );

  return options.label ? (
    <fieldset className="border border-color-2 p-3 rounded">
      <legend className="text-2 opacity-90 text-base font-medium px-1">
        {options.label} {options.required && <div className="text-red-500">*</div>}
      </legend>
      {radioGroup}
    </fieldset>
  ) : (
    radioGroup
  );
}
