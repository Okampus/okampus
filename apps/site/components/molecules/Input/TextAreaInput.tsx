'use client';

import Field from './Field';
import clsx from 'clsx';
import { createRef, forwardRef, memo, useEffect } from 'react';
import { mergeRefs } from 'react-merge-refs';
import type { UncontrolledInput } from '@okampus/shared/types';

export type TextAreaInputProps = {
  inputClassName?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
} & UncontrolledInput<string> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'className' | 'placeholder'>;

export default memo(
  forwardRef<HTMLTextAreaElement, TextAreaInputProps>(function TextAreaInput(props, ref) {
    const localRef = createRef<HTMLTextAreaElement>();

    useEffect(() => {
      if (props.defaultValue && localRef.current) localRef.current.value = props.defaultValue;
    }, [props.defaultValue, localRef]);

    const {
      name,
      onChange,
      error,
      info,
      loading,
      className,
      inputClassName,
      label,
      disabled,
      required,
      description,
      placeholder,
      startContent,
      endContent,
      ...textAreaProps
    } = props;

    const input = (
      <textarea
        ref={mergeRefs([ref, localRef])}
        name={name}
        disabled={disabled}
        // eslint-disable-next-line jsx-a11y/aria-props
        aria-description={description}
        aria-invalid={typeof error === 'string'}
        className={clsx('input !h-auto !max-h-max', inputClassName)}
        placeholder={placeholder}
        onChange={onChange}
        {...textAreaProps}
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
  }),
);
