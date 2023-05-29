import type { InputOptions } from '@okampus/shared/types';

export type NumberInputProps = {
  value: number;
  onChange?: (value: number) => void;
  options: InputOptions;
  step?: number;
  className?: string;
  copyable?: boolean;
};

export function NumberInput({ step = 0.01, value, onChange, options }: NumberInputProps) {
  const afterDecimal = step.toString().split('.')[1]?.length || 0;
  return (
    <fieldset className="relative flex w-full">
      <input
        type="number"
        value={value.toFixed(afterDecimal)}
        className="w-full input cursor-text pt-5"
        onChange={(e) => onChange?.(Number.parseFloat(e.target.value))}
        placeholder=" "
        name={options.name}
        disabled={options.disabled}
        step={step}
      />
      <label htmlFor={options.name} className="input-label">
        {options.label}
        {options.required && <span className="text-red-500">*</span>}
      </label>
    </fieldset>
  );
}
