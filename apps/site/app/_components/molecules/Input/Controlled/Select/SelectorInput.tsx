import Field from '../../Field';

import clsx from 'clsx';
import { Controller } from 'react-hook-form';

import type { ControlledSelect } from '@okampus/shared/types';

// TODO: add swiper for overflowing categories

export type CategorySelectorProps<T> = ControlledSelect<T, false>;

const containerClass = 'flex gap-3';

const getButtonClass = (selected: boolean) =>
  clsx(
    'button border border-[var(--border-2)]',
    selected && 'border-2 border-[var(--primary)] text-[var(--primary)] bg-[var(--active-primary)]',
  );

export default function SelectorInput<T>(props: CategorySelectorProps<T>) {
  if (props.control) {
    const { control, name, options, ...fieldProps } = props;
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <Field {...fieldProps}>
            <div className={containerClass}>
              {options.map(({ label, value: selectValue }, idx) => (
                <button key={idx} onClick={() => onChange(value)} className={getButtonClass(value === selectValue)}>
                  {label}
                </button>
              ))}
            </div>
          </Field>
        )}
      />
    );
  }

  const { onChange, value, options, ...fieldProps } = props;
  return (
    <Field {...fieldProps}>
      <div className={containerClass}>
        {options.map(({ label, value: selectValue }, idx) => (
          <button key={idx} onClick={() => onChange(selectValue)} className={getButtonClass(value === selectValue)}>
            {label}
          </button>
        ))}
      </div>
    </Field>
  );
}
