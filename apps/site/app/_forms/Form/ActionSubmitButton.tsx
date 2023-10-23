'use client';

import SubmitButton from './SubmitButton';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import type { SubmitButtonProps } from './SubmitButton';

export default function ActionSubmitButton({ label, loading, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return <SubmitButton label={label} loading={loading || pending} {...props} />;
}
