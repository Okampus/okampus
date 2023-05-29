import { clsx } from 'clsx';
import { useContext } from 'react';
import { NavigationContext } from '@okampus/ui/hooks';
import { ToastType } from '@okampus/shared/types';

import type { InputOptions } from '@okampus/shared/types';

type InputType = 'text' | 'password' | 'email' | 'date' | 'time' | 'datetime-local';
export type TextInputProps = {
  value: string;
  onChange?: (value: string) => void;
  options: InputOptions;
  type?: InputType;
  className?: string;
  copyable?: boolean;
};

export function TextInput({ type = 'text', value, onChange, options, copyable = false }: TextInputProps) {
  const { setNotification } = useContext(NavigationContext);
  return (
    <fieldset className="relative flex w-full">
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder=" "
        type={type}
        name={options.name}
        disabled={options.disabled}
        className={clsx('w-full input cursor-text pt-5', copyable && '!rounded-r-none')}
      />
      {copyable && (
        <button
          type="button"
          className="flex items-center justify-center text-0 bg-0 rounded-r px-6 font-medium"
          onClick={() => {
            navigator.clipboard.writeText(value || '');
            setNotification({
              type: ToastType.Info,
              message: 'Copié dans le presse-papier !',
            });
          }}
        >
          Copier
        </button>
      )}
      <label htmlFor={options.name} className="input-label">
        {options.label}
        {options.required && <span className="text-red-500">*</span>}
      </label>
    </fieldset>
  );
}
