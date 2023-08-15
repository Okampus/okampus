import { IconLoader } from '@tabler/icons-react';
import clsx from 'clsx';

export type SubmitButtonProps = {
  className?: string;
  type?: 'success' | 'info';
  loading?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
};

export default function SubmitButton({ className, loading, disabled, label }: SubmitButtonProps) {
  return (
    <input
      disabled={disabled}
      type="submit"
      className={clsx(
        'button bg-[var(--primary)] text-white disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
    >
      {loading && <IconLoader />}
      {label ?? 'Soumettre'}
    </input>
  );
}
