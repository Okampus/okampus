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
    console.info('TextInput props change', props);
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
        className={clsx('input', inputClassName, textAlign && (textAlign === 'right' ? 'text-right' : 'text-left'))}
        onChange={onChange}
        {...inputProps}
      />
    );

    const fieldProps = { label, className, name, description, required, error, info, loading };
    return (
      <Field {...fieldProps}>
        {startContent || endContent ? (
          <div className="flex items-stretch">
            {startContent && <label htmlFor={name}>{startContent}</label>}
            {input}
            {endContent && <label htmlFor={name}>{endContent}</label>}
          </div>
        ) : (
          input
        )}
      </Field>
    );
  })
);
