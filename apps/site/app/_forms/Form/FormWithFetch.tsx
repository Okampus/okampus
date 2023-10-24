'use client';

import SubmitButton from './SubmitButton';

import { forwardRef, useState } from 'react';

import type { FormEvent } from 'react';
import type { SubmitButtonProps } from './SubmitButton';
import type { FormMessages } from '../../../server/types';

type SubmitContext<T> = {
  formState: FormMessages<T>;
  setFormState: (state: FormMessages<T>) => void;
  setIsLoading: (state: boolean) => void;
};
export type FormWithFetchProps<T> = {
  submit: (event: FormEvent<HTMLFormElement>, context: SubmitContext<T>) => Promise<void> | void;
  render: (state: FormMessages<T>) => React.ReactNode;
  className?: string;
  submitProps?: SubmitButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
  initialData?: T;
};
export default forwardRef(function FormWithAction<T = undefined>(
  { render, submit, className, submitProps, initialData }: FormWithFetchProps<T>,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<FormMessages<T>>({ data: initialData });

  const rootErrors =
    typeof formState.errors?.root === 'string' ? [formState.errors.root] : formState.errors?.root ?? [];
  return (
    <form
      ref={ref}
      className={className}
      onSubmit={async (event) => {
        event.preventDefault();
        setIsLoading(true);
        await submit(event, { formState, setFormState, setIsLoading });
        setIsLoading(false);
      }}
    >
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
      <SubmitButton loading={isLoading} {...submitProps} />
    </form>
  );
});
