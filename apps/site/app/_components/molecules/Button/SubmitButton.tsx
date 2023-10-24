import { CircleNotch } from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';

export type SubmitButtonProps = {
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
};

export default function SubmitButton({ className, loading, disabled, label }: SubmitButtonProps) {
  return (
    <button
      disabled={disabled}
      type="submit"
      className={clsx(
        'button bg-[var(--primary)] text-white disabled:opacity-50 disabled:cursor-not-allowed',
        loading && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {loading && <CircleNotch className="animate-spin shrink-0 w-7 h-7" />}
      {label ?? 'Soumettre'}
    </button>
  );
}
