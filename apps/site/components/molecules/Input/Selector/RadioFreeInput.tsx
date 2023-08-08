import FieldSet from '../FieldSet';
import clsx from 'clsx';

import { createRef, forwardRef, memo, useEffect, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import type { UncontrolledSelect } from '@okampus/shared/types';

export type RadioFreeInputInputProps = UncontrolledSelect & {
  textAlign?: 'left' | 'right';
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value'>;

export default memo(
  forwardRef<HTMLInputElement, RadioFreeInputInputProps>(function RadioFreeInput(props, ref) {
    const {
      options: choices,
      name,
      onChange,
      error,
      info,
      loading,
      className,
      label,
      disabled,
      description,
      placeholder,
      startContent,
      endContent,
      ...inputProps
    } = props;

    const [selected, setSelected] = useState(choices.findIndex((choice) => choice.value === props.defaultValue));
    const [lastInputValue, setLastInputValue] = useState<string>(selected === -1 ? props.defaultValue ?? '' : '');

    const localRef = createRef<HTMLInputElement>();

    useEffect(() => {
      if (props.defaultValue && localRef.current) {
        localRef.current.value = props.defaultValue;
      }
    }, [props.defaultValue, localRef]);

    const input = (
      <input
        ref={mergeRefs([ref, localRef])}
        className="input"
        disabled={disabled}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        // eslint-disable-next-line jsx-a11y/aria-props
        aria-description={description}
        aria-invalid={typeof error === 'string'}
        {...inputProps}
      />
    );

    const onClickOther = () => {
      setSelected(-1);
      if (localRef.current) {
        localRef.current.focus();
        localRef.current.value = lastInputValue;
        localRef.current.dispatchEvent(new Event('change'));
      }
    };

    const fieldSetClass = clsx('flex flex-wrap gap-2', className);
    const otherClass = clsx('input', selected === -1 ? 'hidden' : 'opacity-50 hover:opacity-100', 'absolute inset-0');

    const fieldSetProps = { label, className, name, description, error, info, loading };

    return (
      <FieldSet {...fieldSetProps}>
        {choices.map(({ value, label }, idx) => {
          const onClick = () => {
            if (selected === -1 && localRef.current) setLastInputValue(localRef.current.value);
            if (localRef.current) {
              localRef.current.value = value;
              localRef.current.dispatchEvent(new Event('change'));
            }
          };

          const buttonClass = clsx('button', selected === idx ? 'bg-2' : 'opacity-50 hover:opacity-100');
          return (
            <button key={value} disabled={disabled} className={buttonClass} onClick={onClick}>
              {label}
            </button>
          );
        })}

        <div className="relative">
          {startContent || endContent ? (
            <div className="flex items-stretch">
              {startContent && <label htmlFor={name}>{startContent}</label>}
              {input}
              {endContent && <label htmlFor={name}>{endContent}</label>}
            </div>
          ) : (
            input
          )}
          <button aria-hidden={true} className={otherClass} onClick={onClickOther}>
            {lastInputValue || placeholder}
          </button>
        </div>
      </FieldSet>
    );
  })
);
