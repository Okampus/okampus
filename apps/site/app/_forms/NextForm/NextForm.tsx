'use client';

import { NextFormSubmitButton } from './NextFormSubmitButton';
import { experimental_useFormState as useFormState } from 'react-dom';

export type NextFormMessages = {
  errors?: Record<string, string> & { root?: string[] | string };
};

const initialState: NextFormMessages = { errors: {} };
export type NextFormProps = {
  action: (previousState: NextFormMessages, formData: FormData) => Promise<NextFormMessages>;
  render: (state: NextFormMessages) => React.ReactNode;
  className?: string;
  submitLabel?: string;
  submitClassName?: string;
};
export default function NextForm({ action, render, className, submitLabel, submitClassName }: NextFormProps) {
  const [state, formAction] = useFormState(action, initialState);
  if (process.env.NODE_ENV !== 'production') console.warn({ state });

  const rootErrors = typeof state?.errors?.root === 'string' ? [state?.errors.root] : state?.errors?.root ?? [];
  return (
    <form className={className} action={formAction}>
      {render(state ?? {})}
      {rootErrors.length > 1
        ? rootErrors.map((error, idx) => (
            <p key={idx} aria-live="polite" className="text-[var(--danger)]">
              • {error}
            </p>
          ))
        : rootErrors.length === 1 && (
            <p aria-live="polite" className="text-[var(--danger)]">
              {rootErrors[0]}
            </p>
          )}
      <NextFormSubmitButton label={submitLabel} className={submitClassName} />
    </form>
  );
}
