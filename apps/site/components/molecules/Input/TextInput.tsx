'use client';

import { notificationAtom } from '../../../context/global';
import { useDidMountEffect } from '../../../hooks/useDidMountEffect';

import { ToastType } from '@okampus/shared/types';

import { IconLoader } from '@tabler/icons-react';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';

import type { ChangeEvent, ClipboardEvent } from 'react';
import type { InputOptions } from '@okampus/shared/types';

export type CheckValueOn = {
  blur?: boolean;
  change?: boolean;
  length?: number;
  paste?: boolean;
};

export type InputType = 'text' | 'password' | 'email' | 'date' | 'time' | 'datetime-local' | 'number';
export type TextInputProps = {
  value: string;
  allowedChars?: RegExp;
  onChange?: (value: string) => void;
  triggerCheck?: boolean;
  format?: (value: string) => string;
  setTriggerCheck?: (value: boolean) => void;
  onErrorChange?: (error: Error | null) => void;
  checkValueError?: (value: string) => Promise<void>;
  infoText?: string | false;
  checkValueOn?: CheckValueOn;
  textAlign?: 'left' | 'right';
  options?: InputOptions;
  rows?: number;
  type?: InputType;
  prefix?: React.ReactNode;
  paddingAfterPrefix?: boolean;
  paddingBeforeSuffix?: boolean;
  suffix?: React.ReactNode;
  prefixClassName?: string;
  suffixClassName?: string;
  className?: string;
  inputClassName?: string;
  copyable?: boolean;
};

export default function TextInput({
  value,
  allowedChars,
  onChange: onChangeFn,
  triggerCheck,
  format,
  setTriggerCheck,
  onErrorChange,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  checkValueError = async () => {},
  checkValueOn = { blur: true, paste: true },
  infoText,
  textAlign = 'left',
  options,
  rows = 1,
  type = 'text',
  prefix,
  suffix,
  paddingAfterPrefix = false,
  paddingBeforeSuffix = false,
  className,
  inputClassName,
  prefixClassName = '',
  suffixClassName = '',
  copyable = false,
}: TextInputProps) {
  const formatFn = format || ((value) => value);

  const [copyActive, setCopyActive] = useState(false);
  const [lastValueChecked, setLastValueChecked] = useState<boolean>(false);
  const [focused, setFocused] = useState(false);
  const [{ error, loading }, checkValue] = useAsyncFn(checkValueError, []);

  const [, setNotification] = useAtom(notificationAtom);

  const check = (value: string) => (checkValue(value), setLastValueChecked(true));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useDidMountEffect(() => {
    error ? onErrorChange?.(error) : onErrorChange?.(null);
  }, [error, lastValueChecked]);
  useEffect(() => {
    if (triggerCheck) {
      check(value);
      setTriggerCheck?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerCheck, checkValue]);

  const placeholder = prefix || suffix ? options?.label || ' ' : ' ';
  const baseClass = clsx(
    inputClassName,
    textAlign === 'right' && 'text-right',
    'w-full input min-h-[var(--h-input)] cursor-text',
    copyable && '!rounded-r-none',
    (!options?.label || prefix || suffix) && '!pt-0',
    prefix && clsx('!rounded-l-none', textAlign === 'left' && !paddingAfterPrefix && '!pl-0'),
    suffix && clsx('!rounded-r-none', textAlign === 'right' && !paddingBeforeSuffix && '!pr-0')
  );

  const change =
    checkValueOn.change || error
      ? (value: string) => (!allowedChars || allowedChars.test(value)) && (onChangeFn?.(value), check(value))
      : (newValue: string) => {
          if (!allowedChars || allowedChars.test(newValue)) {
            if (
              // eslint-disable-next-line unicorn/explicit-length-check
              checkValueOn.length &&
              (newValue.length === checkValueOn.length ||
                (value.length >= checkValueOn.length && newValue.length < checkValueOn.length))
            )
              check(newValue);
            else setLastValueChecked(false);
            onChangeFn?.(newValue);
          }
        };

  const onBlur = checkValueOn.blur
    ? () => (setFocused(false), !lastValueChecked && check(value))
    : () => setFocused(false);

  const onPaste = (e: ClipboardEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setTimeout(
      () =>
        // eslint-disable-next-line unicorn/explicit-length-check
        (checkValueOn.paste || (checkValueOn.length && target.value.length >= checkValueOn.length)) &&
        check(target.value),
      25
    );
  };

  const onChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) =>
    change(formatFn(e.target.value));

  const inputOptions = { value, onBlur, onChange, onFocus: () => setFocused(true), onPaste, placeholder, ...options };

  const input =
    rows > 1 ? (
      <textarea
        {...inputOptions}
        disabled={options?.disabled}
        rows={rows}
        className={clsx('resize-none pb-2 [&+.input-label]:bg-[var(--bg-input)] pt-7', baseClass)}
      />
    ) : (
      <input {...inputOptions} disabled={options?.disabled} type={type} className={clsx(baseClass, 'pt-5')} />
    );

  return (
    <div role="input" className={clsx('w-full', className, options?.disabled && 'opacity-50')}>
      <span
        className={clsx(
          'w-full flex rounded-lg box-border',
          focused && 'outline-2 outline',
          error ? 'outline-2 outline-[var(--danger)]' : 'border-transparent outline-[var(--border-3)]'
        )}
      >
        {prefix && (
          <div
            className={clsx(
              'shrink-0 flex items-center justify-center pl-3 pr-0.5 font-semibold text-0 rounded-l-lg bg-[var(--bg-input)]',
              prefixClassName
            )}
          >
            {prefix}
          </div>
        )}
        <fieldset className="w-full relative flex rounded-lg bg-[var(--bg-input)]">
          {input}
          {loading && <IconLoader className="animate-spin shrink-0 self-center h-5 w-5 mr-3 text-1" />}
          {options?.label && !options.placeholder && !suffix && !prefix && (
            <label {...(options?.name && { htmlFor: options.name })} className="input-label">
              {options.label}
              {options.required && <span className="text-red-500">*</span>}
            </label>
          )}
        </fieldset>
        {suffix && (
          <div
            className={clsx(
              'shrink-0 flex items-center justify-center pr-3 pl-0.5 font-semibold text-0 rounded-r-lg bg-[var(--bg-input)]',
              suffixClassName
            )}
          >
            {suffix}
          </div>
        )}
        {copyable && (
          <button
            type="button"
            className={clsx('shrink-0 text-0 rounded-r px-6 font-medium', copyActive ? 'bg-[var(--success)]' : 'bg-0')}
            onClick={() => {
              navigator.clipboard.writeText(value || '');
              setNotification({ type: ToastType.Info, message: 'Copié !' });
              setCopyActive(true);
              setTimeout(() => setCopyActive(false), 400);
            }}
          >
            {copyActive ? 'Copié !' : 'Copier'}
          </button>
        )}
      </span>
      {error ? (
        <div className="text-[var(--danger)] text-xs font-medium pt-2 px-2">{error.message}</div>
      ) : (
        infoText && <div className="text-[var(--text-1)] text-xs font-medium pt-2 px-2">{infoText}</div>
      )}
    </div>
  );
}
