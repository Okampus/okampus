'use client';

import Field from '../../Field';
import { useUncontrolledInputConfig } from '../../../../../_hooks/useUncontrolledInputConfig';

import { Copy } from '@phosphor-icons/react';

import clsx from 'clsx';

import { forwardRef, memo, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

import type { RegisterOptions } from 'react-hook-form';
import type { UncontrolledInput } from '@okampus/shared/types';

export type TextInputProps = {
  // TODO: improve allowedChars on copy/paste
  allowedChars?: RegExp;
  textAlign?: 'left' | 'right';
  start?: React.ReactNode;
  startClassName?: string;
  end?: React.ReactNode;
  endClassName?: string;
  copyable?: boolean;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  registerOptions?: RegisterOptions;
} & UncontrolledInput<string>;

export const baseStartClass = 'flex h-[var(--h-input)] items-center bg-[var(--bg-main)] rounded-l-md shrink-0';
export const baseEndClass = 'flex h-[var(--h-input)] items-center bg-[var(--bg-main)] rounded-r-md shrink-0';

const allowedSpecialChars = new Set([
  'Backspace',
  'Delete',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Tab',
  'Enter',
  'Escape',
  'Control',
  'Meta',
]);
const copyClassName = 'text-0 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer';

const copy = (localRef: React.MutableRefObject<HTMLInputElement | null>) => () => {
  navigator.clipboard.writeText(localRef.current?.value ?? '');
  toast.info('Valeur copiée dans le presse-papier');
};

export default memo(
  forwardRef<HTMLInputElement, TextInputProps>(function TextInput(props, forwardedRef) {
    const localRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);

    const { textAlign, copyable, type, defaultValue, disabled, placeholder, allowedChars, ...otherProps } = props;
    const { start, startClassName, end, endClassName, registerOptions, ...field } = otherProps;

    const onBlur = () => setFocused(false);
    const onFocus = () => setFocused(true);

    const onKeyDown = allowedChars
      ? (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { key } = event;
          if (
            allowedChars &&
            !allowedSpecialChars.has(key) &&
            !allowedChars.test(key) &&
            !event.ctrlKey &&
            !event.metaKey
          )
            event.preventDefault();
        }
      : undefined;

    const options = { name: field.name, onBlur, ...registerOptions };
    const { ref, ...registerProps } = useUncontrolledInputConfig(options);

    useImperativeHandle(ref, () => localRef.current as HTMLInputElement);
    useImperativeHandle(forwardedRef, () => localRef.current as HTMLInputElement);

    const a11yProps = { 'aria-invalid': typeof field.error === 'string', 'aria-description': field.description };

    const textAlignClass = textAlign && (textAlign === 'right' ? 'text-right' : 'text-left');
    const className = clsx(
      'input max-h-[var(--h-input)]',
      field.error && 'invalid',
      start && '!rounded-l-none !pl-0 !border-l-0 !outline-none',
      end && '!rounded-r-none !pr-0 !border-r-0 !outline-none',
      textAlignClass,
      copyable && '!pr-12',
    );

    const inputProps = { className, type: type ?? 'text', onFocus, disabled, placeholder, defaultValue };
    const input = <input {...a11yProps} {...inputProps} onKeyDown={onKeyDown} {...registerProps} ref={localRef} />;

    return (
      <Field {...field}>
        {start || end || copyable ? (
          <div
            className={clsx(
              'flex shrink min-w-0 items-stretch font-semibold w-full rounded border border-[var(--border-1)]',
              !disabled && 'hover:border-[var(--border-0)]',
              focused && 'outline outline-4 outline-[var(--active)]',
            )}
          >
            {start && (
              <div
                onClick={() => localRef.current?.focus()}
                className={clsx(baseStartClass, disabled && 'opacity-50 pointer-events-none', startClassName ?? 'px-3')}
              >
                {start}
              </div>
            )}
            <div className="relative w-full [&>input]:!border-none">
              {input}
              {copyable && <Copy className={copyClassName} onClick={copy(localRef)} />}
            </div>
            {end && (
              <div
                onClick={() => localRef.current?.focus()}
                className={clsx(baseEndClass, disabled && 'opacity-50 pointer-events-none', endClassName ?? 'px-3')}
              >
                {end}
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
