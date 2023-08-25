import { IconLoader } from '@tabler/icons-react';

export type FieldProps = {
  name?: string;
  children: React.ReactNode;
  label?: React.ReactNode;
  className?: string;
  required?: boolean;
  error?: string | null | false;
  loading?: boolean;
  info?: React.ReactNode;
  description?: string;
  horizontal?: boolean;
};

export default function Field({
  name,
  children,
  label,
  className = 'w-full flex flex-col gap-0.5',
  required,
  error,
  loading,
  info,
  description,
  horizontal,
}: FieldProps) {
  let subtitle = info ? <div className="text-[var(--info)] text-sm px-2">{info}</div> : null;
  if (loading)
    subtitle = (
      <p className="text-[var(--info)] flex gap-2 text-sm px-2">
        <IconLoader className="animate-spin shrink-0 h-5 w-5 pt-1" />
        Vérification...
      </p>
    );
  else if (error) subtitle = <div className="text-[var(--danger)] text-sm font-medium px-2">{error}</div>;

  const inner = horizontal ? (
    <>
      <span className="flex justify-between items-start">
        {label && (
          <label htmlFor={name} className="label-title">
            {label} {required && <span className="text-[var(--danger)]">*</span>}
          </label>
        )}
        {children}
      </span>
      {description && <p className="text-2 text-sm px-2">{description}</p>}
    </>
  ) : (
    <>
      {label && (
        <label htmlFor={name} className="label-title">
          {label} {required && <span className="text-[var(--danger)]">*</span>}
        </label>
      )}
      {description && <div className="text-2 text-sm px-2">{description}</div>}
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
