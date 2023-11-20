import FieldSet from '../../FieldSet';

import { baseEndClass, baseStartClass } from '../../Uncontrolled/String/TextInput';
import clsx from 'clsx';

import { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';

import type { ControlledSelect } from '@okampus/shared/types';
import type { ChangeEvent } from 'react';

export type SelectorWithOtherProps<T> = ControlledSelect<T, false> & {
  textAlign?: 'left' | 'right';
  start?: React.ReactNode;
  end?: React.ReactNode;
};

type SelectorWithOtherInnerProps<T> = {
  props: SelectorWithOtherProps<T>;
  value: string | undefined;
  onChange: (value: string) => void;
};

function SelectorWithOtherInner({ props, value, onChange: onChangeValue }: SelectorWithOtherInnerProps<string>) {
  const { options, name, className, start, end, control, textAlign, ...fieldProps } = props;
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);

  const localRef = useRef<HTMLInputElement | null>(null);

  const focusOtherClass = clsx('input', isOtherSelected && '!hidden', 'absolute top-0 left-0 w-full h-full');
  const onFocusOtherClick = () => {
    setIsOtherSelected(true);
    localRef.current?.focus();
    onChangeValue(localRef.current?.value || '');
  };
  const focusOtherProps = { className: focusOtherClass, onClick: onFocusOtherClick, disabled: props.disabled };

  const a11yProps = { 'aria-invalid': typeof props.error === 'string', 'aria-description': props.description };
  const inputClass = clsx('input', start && '!rounded-l-none !pl-0', end && '!rounded-r-none !pr-0');
  const inputProps = { ...a11yProps, disabled: props.disabled, placeholder: props.placeholder, className: inputClass };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => onChangeValue(event.target.value);
  const input = (
    <div className={clsx('relative', isOtherSelected && 'opacity-50 hover:opacity-100')}>
      <input ref={(ref) => (localRef.current = ref)} onChange={onChange} {...inputProps} />
      <button type="button" {...focusOtherProps}>
        {props.placeholder}
      </button>
    </div>
  );

  const field = { ...fieldProps, className: clsx('flex flex-wrap gap-2', className), name };
  return (
    <FieldSet {...field}>
      {options.map(({ value: optionValue, label }) => {
        const onClick = () => {
          setIsOtherSelected(false);
          onChangeValue(optionValue);
        };

        const buttonClass = clsx(
          'font-medium rounded-lg px-3 py-2 border border-[var(--border-1)]',
          !isOtherSelected && optionValue === value ? 'bg-2' : 'bg-[var(--bg-main)] opacity-50 hover:opacity-100',
        );
        return (
          <button type="button" key={value} disabled={props.disabled} className={buttonClass} onClick={onClick}>
            {label}
          </button>
        );
      })}

      {start || end ? (
        <div className="flex">
          {start && <div className={baseStartClass}>{start}</div>}
          {input}
          {end && <div className={baseEndClass}>{end}</div>}
        </div>
      ) : (
        input
      )}
    </FieldSet>
  );
}

export default function SelectorWithOther(props: SelectorWithOtherProps<string>) {
  if (props.control) {
    return (
      <Controller
        name={props.name}
        control={props.control}
        render={({ field }) => <SelectorWithOtherInner props={props} value={field.value} onChange={field.onChange} />}
      />
    );
  }

  return <SelectorWithOtherInner props={props} value={props.value} onChange={props.onChange} />;
}
