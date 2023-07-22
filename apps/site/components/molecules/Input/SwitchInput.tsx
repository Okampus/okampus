import clsx from 'clsx';
import type { InputOptions } from '@okampus/shared/types';

export type SwitchInputProps = {
  checked: boolean;
  subtitle?: React.ReactNode;
  onChange: (value: boolean) => void;
  options: InputOptions;
};
export default function SwitchInput({ checked, subtitle, onChange, options }: SwitchInputProps) {
  const wrapperClass =
    'relative w-fit flex items-center justify-between cursor-pointer h-6 aspect-[1.8/1] rounded-full';
  const switchInput = (
    <label className={clsx(wrapperClass, checked ? 'bg-[var(--success)]' : 'bg-2')} htmlFor={options.name}>
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
      <fieldset className="flex flex-col gap-2">
        <span className="w-full flex justify-between items-start gap-10 text-0 font-semibold text-sm">
          {options.label}
          {switchInput}
        </span>
        {subtitle && <span className="text-1 text-xs font-medium">{subtitle}</span>}
      </fieldset>
    );

  return switchInput;
}
