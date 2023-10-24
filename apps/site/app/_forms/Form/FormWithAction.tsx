'use client';

import ActionSubmitButton from './ActionSubmitButton';
import { forwardRef } from 'react';
import { experimental_useFormState as useFormState } from 'react-dom';

import type { FormEventHandler } from 'react';
import type { SubmitButtonProps } from './SubmitButton';
import type { FormMessages, ServerAction } from '../../../server/types';

export type ServerActionFormProps<T> = {
  action: ServerAction<T>;
  render: (state: FormMessages<T>) => React.ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  className?: string;
  submitProps?: SubmitButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
  initialData?: T;
};
export default forwardRef(function ServerActionForm<T = undefined>(
  { action, render, onSubmit, className, submitProps, initialData }: ServerActionFormProps<T>,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  const [formState, formAction] = useFormState(action, { data: initialData });
  if (process.env.NODE_ENV !== 'production') console.warn({ formState, action });

  const rootErrors =
    typeof formState.errors?.root === 'string' ? [formState.errors.root] : formState.errors?.root ?? [];
  return (
    <form ref={ref} action={formAction} className={className} onSubmit={onSubmit}>
      <div className="mb-5 flex flex-col gap-4">
        {render(formState)}
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
      <ActionSubmitButton {...submitProps} />
    </form>
  );
});
