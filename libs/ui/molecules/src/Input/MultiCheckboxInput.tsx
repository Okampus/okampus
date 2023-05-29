import { ReactComponent as CheckFilledIcon } from '@okampus/assets/svg/icons/material/filled/check.svg';
import type { InputOptions, SelectItem } from '@okampus/shared/types';

export type MultiCheckboxInputProps<T> = {
  items: SelectItem<T>[];
  selected: boolean[];
  onChange: (value: boolean[]) => void;
  options: InputOptions;
};

export function MultiCheckboxInput<T>({ items, selected, onChange, options }: MultiCheckboxInputProps<T>) {
  const checkboxGroup = (
    <div className="flex flex-col gap-3 px-1.5">
      {items.map((item, index) => {
        const name = `${options.name}-${index}`;
        return (
          <label
            key={index}
            htmlFor={name}
            className="flex items-center gap-3 text-1 font-medium text-lg cursor-pointer"
          >
            <div className="relative w-7 h-7 rounded">
              <input
                id={name}
                name={name}
                type="checkbox"
                checked={selected[index]}
                onChange={() =>
                  onChange(
                    selected.length === items.length
                      ? selected.map((checked, idx) => (idx === index ? !checked : checked))
                      : items.map((_, idx) => idx === index)
                  )
                }
                className="absolute top-0 left-0 w-full h-full opacity-0"
              />
              <div className="absolute inset-0 bg-2 border rounded">
                {selected[index] && (
                  <CheckFilledIcon className="absolute inset-0 bg-opposite text-opposite rounded-sm" />
                )}
              </div>
            </div>
            {item.label}
          </label>
        );
      })}
    </div>
  );

  return options.label ? (
    <fieldset className="border border-color-2 px-3 py-2.5 rounded">
      <legend className="text-1 opacity-90 text-lg font-medium px-1">
        {options.label} {options.required && <div className="text-red-500">*</div>}
      </legend>
      {checkboxGroup}
    </fieldset>
  ) : (
    checkboxGroup
  );
}
