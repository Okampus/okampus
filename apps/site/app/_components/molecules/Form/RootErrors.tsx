import { useFormState } from 'react-hook-form';

export type RootErrorsProps = {
  errors?: string | string[];
};
export default function RootErrors({ errors }: RootErrorsProps) {
  const state = useFormState();

  const formStateErrors = state.errors ?? { root: undefined };
  const formErrors =
    typeof formStateErrors.root?.message === 'string'
      ? [formStateErrors.root.message]
      : formStateErrors.root?.message ?? [];

  errors = typeof errors === 'string' ? [errors] : errors ?? [];
  const errorsRoot = [...errors, ...formErrors];

  return errorsRoot.length > 1
    ? errorsRoot.map((error) => (
        <p key={error} aria-live="polite" className="text-[var(--danger)]">
          • {error}
        </p>
      ))
    : errorsRoot.length === 1 && (
        <p aria-live="polite" className="text-[var(--danger)]">
          {errorsRoot[0]}
        </p>
      );
}
