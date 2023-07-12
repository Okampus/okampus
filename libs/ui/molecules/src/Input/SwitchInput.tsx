import clsx from 'clsx';
import type { InputOptions } from '@okampus/shared/types';

export type SwitchInputProps = { checked: boolean; onChange: (value: boolean) => void; options: InputOptions };
export function SwitchInput({ checked, onChange, options }: SwitchInputProps) {
  const wrapperClass = 'relative flex items-center justify-between cursor-pointer h-8 aspect-[1.8/1] rounded-full';

  const switchInput = (
    <label className={clsx(wrapperClass, checked ? 'bg-[var(--success)]' : 'bg-5')} htmlFor={options.name}>
      <input
        id={options.name}
        name={options.name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden h-0 w-0"
        type="checkbox"
      />
      <span
        className={clsx(
          'absolute inset-y-[3px] aspect-square rounded-full bg-white',
          checked ? 'right-[3px]' : 'left-[3px]'
        )}
      />
    </label>
  );

  if (options.label)
    return (
      <div className="w-full flex justify-between items-start gap-10 text-1 font-medium text-lg">
        {options.label}
        {switchInput}
      </div>
    );

  return switchInput;
}
