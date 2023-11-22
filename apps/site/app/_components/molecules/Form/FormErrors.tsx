'use client';

import RenderErrors from './RenderErrors';
import { useFormState } from 'react-hook-form';

export type FormErrorsProps = { errors?: string | string[] };
export default function FormErrors({ errors }: FormErrorsProps) {
  const state = useFormState();

  const formStateErrors = state.errors ?? { root: undefined };
  const formErrors =
    typeof formStateErrors.root?.message === 'string'
      ? [formStateErrors.root.message]
      : formStateErrors.root?.message ?? [];

  errors = typeof errors === 'string' ? [errors] : errors ?? [];
  const errorsRoot = [...errors, ...formErrors];

  return <RenderErrors errors={errorsRoot} />;
}
