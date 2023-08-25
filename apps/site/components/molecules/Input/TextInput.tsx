'use client';

import Field from './Field';
import clsx from 'clsx';
import { createRef, forwardRef, memo, useEffect } from 'react';
import { mergeRefs } from 'react-merge-refs';

import type { UncontrolledInput } from '@okampus/shared/types';

export type TextInputProps = {
  inputClassName?: string;
  textAlign?: 'left' | 'right';
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  copyable?: boolean;
} & UncontrolledInput<string> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'className' | 'placeholder'>;

export default memo(
  forwardRef<HTMLInputElement, TextInputProps>(function TextInput(props, ref) {
    const localRef = createRef<HTMLInputElement>();

    useEffect(() => {
      if (props.defaultValue && localRef.current) localRef.current.value = props.defaultValue;
    }, [props.defaultValue, localRef]);

    const {
      copyable,
      name,
      onChange,
      error,
      info,
      loading,
      className,
      label,
      disabled,
      required,
      description,
      startContent,
      endContent,
      inputClassName,
      textAlign,
      ...inputProps
    } = props;

    const input = (
      <input
        ref={mergeRefs([ref, localRef])}
        name={name}
        disabled={disabled}
        // eslint-disable-next-line jsx-a11y/aria-props
        aria-description={description}
        aria-invalid={typeof error === 'string'}
        className={clsx(
          'input h-[var(--h-input)] max-h-[var(--h-input)]',
          inputClassName,
          startContent && '!rounded-l-none !pl-0 !border-l-0',
          endContent && '!rounded-r-none !pr-0 !border-r-0',
          textAlign && (textAlign === 'right' ? 'text-right' : 'text-left'),
          !startContent && !endContent && error && '!outline !outline-1 !outline-[var(--danger)] text-[var(--danger)]',
        )}
        onChange={onChange}
        {...inputProps}
      />
    );

    const fieldProps = { label, className, name, description, required, error, info, loading };
    return (
      <Field {...fieldProps}>
        {startContent || endContent ? (
          <div
            className={clsx(
              'flex shrink min-w-0 items-stretch font-semibold w-full rounded-md',
              error && 'outline outline-offset-2 outline-1 outline-[var(--danger)]',
            )}
          >
            {startContent && (
              <div className="border border-[var(--border-1)] !border-r-0 flex h-[var(--h-input)] items-center pl-3 bg-[var(--bg-input)] rounded-l-md shrink-0">
                {startContent}
              </div>
            )}
            {input}
            {endContent && (
              <div className="border border-[var(--border-1)] !border-l-0 flex h-[var(--h-input)] items-center pr-3 bg-[var(--bg-input)] rounded-r-md shrink-0">
                {endContent}
              </div>
            )}
          </div>
        ) : (
          input
        )}
      </Field>
    );
  }),
);
