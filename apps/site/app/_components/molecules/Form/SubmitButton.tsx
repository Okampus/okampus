'use client';

import clsx from 'clsx';
import { CircleNotch } from '@phosphor-icons/react';

export type SubmitButtonProps = {
  label?: React.ReactNode;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export default function SubmitButton({
  label,
  loading,
  className = 'w-full bg-[var(--bg-opposite)] text-[var(--text-opposite)]',
  ...props
}: SubmitButtonProps) {
  const { disabled, ...buttonProps } = props;
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      aria-disabled={loading}
      className={clsx(
        className,
        loading && 'opacity-50 cursor-not-allowed',
        'button disabled:opacity-50 disabled:cursor-not-allowed',
      )}
      {...buttonProps}
    >
      {loading && <CircleNotch className="animate-spin shrink-0 w-7 h-7" />}
      {label ?? 'Soumettre'}
    </button>
  );
}
