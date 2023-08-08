import { IconLoader } from '@tabler/icons-react';

export type FieldProps = {
  name: string;
  children: React.ReactNode;
  label?: React.ReactNode;
  className?: string;
  required?: boolean;
  error?: string | null;
  loading?: boolean;
  info?: React.ReactNode;
  description?: string;
  horizontal?: boolean;
};

export default function Field({
  name,
  children,
  label,
  className = 'w-full flex flex-col gap-2',
  required,
  error,
  loading,
  info,
  description,
  horizontal,
}: FieldProps) {
  let subtitle = info;
  if (loading)
    subtitle = (
      <p className="text-[var(--info)] flex gap-2 text-sm">
        <IconLoader className="animate-spin shrink-0 h-5 w-5 pt-1" />
        Vérification...
      </p>
    );
  else if (error) subtitle = <p className="text-[var(--danger)] text-sm font-medium">{error}</p>;

  const inner = horizontal ? (
    <>
      <span className="flex justify-between">
        {label && (
          <label htmlFor={name} className="text-2 label-title">
            {label} {required && <span className="text-[var(--danger)]">*</span>}
          </label>
        )}
      </span>
      {description && <p className="text-2 text-sm">{description}</p>}
    </>
  ) : (
    <>
      {label && (
        <label htmlFor={name} className="text-2 label-title">
          {label} {required && <span className="text-[var(--danger)]">*</span>}
        </label>
      )}
      {description && <p className="text-2 text-sm">{description}</p>}
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
