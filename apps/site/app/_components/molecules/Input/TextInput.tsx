'use client';

import Field from './Field';
import { notificationAtom } from '../../../_context/global';

import { ToastType } from '@okampus/shared/types';

import clsx from 'clsx';

import { useAtom } from 'jotai';
import { mergeRefs } from 'react-merge-refs';
import { createRef, forwardRef, memo, useEffect, useState } from 'react';

import { Copy } from '@phosphor-icons/react';

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
    const [focused, setFocused] = useState(false);

    const [, setNotification] = useAtom(notificationAtom);
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
      onBlur,
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
        onFocus={() => setFocused(true)}
        onBlur={(evt) => {
          setFocused(false);
          onBlur?.(evt);
        }}
        className={clsx(
          'input h-[var(--h-input)] max-h-[var(--h-input)]',
          inputClassName,
          startContent && '!rounded-l-none !pl-0 !border-l-0',
          endContent && '!rounded-r-none !pr-0 !border-r-0',
          textAlign && (textAlign === 'right' ? 'text-right' : 'text-left'),
          error && '!border-[var(--danger)] !text-[var(--danger)]',
          copyable && '!pr-12',
        )}
        onChange={onChange}
        {...inputProps}
      />
    );

    const fieldProps = { label, className, name, description, required, error, info, loading };

    let border = 'border-[var(--border-1)]';
    if (error) border = 'border-[var(--danger)] !text-[var(--danger)]';
    else if (focused) border = '!border-[var(--info)]';

    return (
      <Field {...fieldProps}>
        {startContent || endContent || copyable ? (
          <div className="flex shrink min-w-0 items-stretch font-semibold w-full rounded-md">
            {startContent && (
              <div
                className={clsx(
                  border,
                  'border-2 !border-r-0 flex h-[var(--h-input)] items-center pl-3 bg-[var(--bg-input)] rounded-l-md shrink-0',
                )}
              >
                {startContent}
              </div>
            )}
            <div className="relative w-full">
              {input}
              {copyable && (
                <Copy
                  className="text-0 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(localRef.current?.value ?? '');
                    setNotification({
                      message: 'Valeur copiée dans le presse-papier',
                      type: ToastType.Info,
                    });
                  }}
                />
              )}
            </div>
            {endContent && (
              <div
                className={clsx(
                  border,
                  'border-2 border-[var(--border-1)] !border-l-0 flex h-[var(--h-input)] items-center pr-3 bg-[var(--bg-input)] rounded-r-md shrink-0',
                )}
              >
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
