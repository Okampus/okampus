import { CircleNotch } from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';

export type FieldProps = {
  name?: string;
  children: React.ReactNode;
  label?: React.ReactNode;
  className?: string;
  required?: boolean;
  error?: string | null | false;
  loading?: boolean;
  loadingLabel?: string;
  info?: React.ReactNode;
  description?: string;
  horizontal?: boolean;
};

const labelClassName = 'block text-sm font-medium text-[var(--text-2)] mb-2';

export default function Field({
  name,
  children,
  label,
  className = 'w-full',
  required,
  error,
  loading,
  loadingLabel,
  info,
  description,
  horizontal,
}: FieldProps) {
  let subtitle = info ? <span className="text-[var(--info)] text-sm">{info}</span> : null;
  if (loading)
    subtitle = (
      <p className="text-[var(--info)] flex gap-2 text-sm">
        <CircleNotch className="animate-spin shrink-0 h-5 w-5 pt-1" />
        {loadingLabel ?? 'Vérification...'}
      </p>
    );
  else if (error)
    subtitle = (
      <span role="alert" className="text-[var(--danger)] text-sm font-medium">
        {error}
      </span>
    );

  const inner = horizontal ? (
    <>
      <span className="flex justify-between items-start">
        {label && (
          <label htmlFor={name} className={labelClassName}>
            {label} {required && <span className="text-[var(--danger)]">*</span>}
          </label>
        )}
        {children}
      </span>
      {description && <p className="text-2 text-sm">{description}</p>}
    </>
  ) : (
    <>
      {label && (
        <label htmlFor={name} className={clsx(labelClassName, error && 'text-[var(--danger)]')}>
          {label} {required && <span className="text-[var(--danger)]">*</span>}
        </label>
      )}
      {description && <div className="text-2 text-sm">{description}</div>}
      {children}
    </>
  );

  return (
    <div className={className}>
      {inner}
      {subtitle}
    </div>
  );
}
