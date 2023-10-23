'use client';

import { NextFormSubmitButton } from './NextFormSubmitButton';

import { forwardRef } from 'react';
import { experimental_useFormState as useFormState } from 'react-dom';

import type { FormEventHandler } from 'react';
import type { NextFormSubmitButtonProps } from './NextFormSubmitButton';
import type { NextFormMessages, NextServerAction } from '../../../server/types';

export type NextFormProps<T> = {
  action: NextServerAction<T>;
  render: (state: NextFormMessages<T>) => React.ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  className?: string;
  submitProps?: NextFormSubmitButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
  initialData?: NextFormMessages<T>;
};
export default forwardRef(function NextForm<T>(
  { action, render, onSubmit, className, submitProps, initialData }: NextFormProps<T>,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  const [state, formAction] = useFormState(action, initialData ?? {});
  if (process.env.NODE_ENV !== 'production') console.warn({ state, action });

  const rootErrors = typeof state.errors?.root === 'string' ? [state.errors.root] : state.errors?.root ?? [];
  return (
    <form ref={ref} action={formAction} className={className} onSubmit={onSubmit}>
      <div className="mb-5 flex flex-col gap-4">
        {render(state)}
        {rootErrors.length > 1
          ? rootErrors.map((error) => (
              <p key={error} aria-live="polite" className="text-[var(--danger)]">
                • {error}
              </p>
            ))
          : rootErrors.length === 1 && (
              <p aria-live="polite" className="text-[var(--danger)]">
                {rootErrors[0]}
              </p>
            )}
      </div>
      <NextFormSubmitButton {...submitProps} />
    </form>
  );
});
