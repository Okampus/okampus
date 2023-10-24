import FieldSet from '../FieldSet';
import { triggerOnChange } from '../../../../../utils/dom/trigger-on-change';

import clsx from 'clsx';

import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import type { UncontrolledSelect } from '@okampus/shared/types';

export type RadioFreeInputInputProps = UncontrolledSelect & {
  textAlign?: 'left' | 'right';
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  value?: string;
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
      value,
      ...inputProps
    } = props;

    const [selected, setSelected] = useState(choices.findIndex((choice) => choice.value === props.defaultValue));
    const [lastInputValue, setLastInputValue] = useState<string>(selected === -1 ? props.defaultValue ?? '' : '');

    const localRef = useRef<HTMLInputElement>();

    useEffect(() => {
      if (props.defaultValue && localRef.current) {
        localRef.current.value = props.defaultValue;
        const choice = choices.findIndex((choice) => choice.value === props.defaultValue);
        setSelected(choice);
        if (choice === -1) setLastInputValue(props.defaultValue);
      }
    }, [props.defaultValue, choices]);

    useEffect(() => {
      if (selected !== -1 || localRef.current?.value !== value) {
        const choice = choices.findIndex((choice) => choice.value === value);
        setSelected(choice);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, choices]);

    const otherClass = clsx('input', selected === -1 && '!hidden', 'absolute top-0 left-0 w-full h-full');

    const onClickOther = () => {
      setSelected(-1);
      if (localRef.current) {
        localRef.current.focus();
        triggerOnChange(localRef.current, lastInputValue);
      }
    };

    const input = (
      <div className={clsx('relative', selected !== -1 && 'opacity-50 hover:opacity-100')}>
        <input
          ref={mergeRefs([ref, localRef])}
          className={clsx('input', startContent && '!rounded-l-none !pl-0', endContent && '!rounded-r-none !pr-0')}
          disabled={disabled}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          // eslint-disable-next-line jsx-a11y/aria-props
          aria-description={description}
          aria-invalid={typeof error === 'string'}
          {...inputProps}
        />
        <button type="button" aria-hidden={true} className={otherClass} onClick={onClickOther}>
          {lastInputValue || placeholder}
        </button>
      </div>
    );

    const fieldSetClass = clsx('flex flex-wrap gap-2', className);

    const fieldSetProps = { label, className: fieldSetClass, name, description, error, info, loading };

    return (
      <FieldSet {...fieldSetProps}>
        {choices.map(({ value, label }, idx) => {
          const onClick = () => {
            if (localRef.current) triggerOnChange(localRef.current, value);
            setSelected(idx);
          };

          const buttonClass = clsx(
            'font-medium rounded-lg px-3 py-2 border border-[var(--border-1)]',
            selected === idx ? 'bg-2' : 'bg-[var(--bg-input)] opacity-50 hover:opacity-100',
          );
          return (
            <button type="button" key={value} disabled={disabled} className={buttonClass} onClick={onClick}>
              {label}
            </button>
          );
        })}

        {startContent || endContent ? (
          <div className="flex">
            {startContent && (
              <div className="flex h-[var(--h-input)] items-center px-3 bg-opposite text-opposite rounded-l-md shrink-0 font-semibold text-lg">
                {startContent}
              </div>
            )}
            {input}
            {endContent && (
              <div className="flex h-[var(--h-input)] items-center px-3 bg-opposite text-opposite rounded-r-md shrink-0 font-semibold text-lg">
                {endContent}
              </div>
            )}
          </div>
        ) : (
          input
        )}
      </FieldSet>
    );
  }),
);
