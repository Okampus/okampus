import clsx from 'clsx';
import type { InputOptions } from '@okampus/shared/types';

export type ToggleInputProps = {
  left: React.ReactNode;
  right: React.ReactNode;
  state: boolean;
  subtitle?: React.ReactNode;
  onChange: (value: boolean) => void;
  options: InputOptions;
};
export default function ToggleInput({ left, right, state, subtitle, onChange, options }: ToggleInputProps) {
  const wrapperClass = 'relative flex cursor-pointer h-[var(--h-input)] rounded-md';
  const itemClass = 'h-full w-1/2 flex items-center justify-center';
  const switchInput = (
    <label className={clsx(wrapperClass, state ? 'bg-[var(--success)]' : 'bg-2')} htmlFor={options.name}>
      <input
        id={options.name}
        name={options.name}
        checked={state}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden h-0 w-0"
        type="checkbox"
      />
      <span className={clsx(itemClass, !state && 'bg-0')}>{left}</span>
      <span className={clsx(itemClass, state && 'bg-0')}>{right}</span>
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
