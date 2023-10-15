'use client';

import clsx from 'clsx';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { CircleNotch } from '@phosphor-icons/react';

export type NextFormSubmitButtonProps = { label?: React.ReactNode };
export function NextFormSubmitButton({
  label,
  className = 'w-full bg-opposite text-opposite',
  ...props
}: NextFormSubmitButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  const cn = clsx(
    className,
    pending && 'opacity-50 cursor-not-allowed',
    'button disabled:opacity-50 disabled:cursor-not-allowed',
  );

  return (
    <button type="submit" disabled={pending || props.disabled} aria-disabled={pending} className={cn}>
      {pending && <CircleNotch className="animate-spin shrink-0 w-7 h-7" />}
      {label ?? 'Soumettre'}
    </button>
  );
}
