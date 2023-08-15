import { IconLoader } from '@tabler/icons-react';

export type FieldSetProps = {
  children: React.ReactNode;
  label?: React.ReactNode;
  required?: boolean;
  className?: string;
  error?: string | null | boolean;
  info?: React.ReactNode;
  loading?: boolean;
  description?: string;
};

export default function FieldSet({
  label,
  className = 'w-full flex flex-col gap-2',
  required,
  error,
  info,
  loading,
  description,
  children,
}: FieldSetProps) {
  let subtitle = info;
  if (loading)
    subtitle = (
      <p className="text-[var(--info)] flex gap-2">
        <IconLoader className="animate-spin shrink-0 h-5 w-5 pt-1" />
        Vérification...
      </p>
    );
  else if (error) subtitle = <p className="text-[var(--danger)] text-sm font-medium">{error}</p>;

  return (
    <fieldset className={className}>
      {label && (
        <legend className="text-2 label-title mb-2">
          {label} {required && <span className="text-[var(--danger)]">*</span>}
        </legend>
      )}
      {description && <p className="text-2 mb-2">{description}</p>}
      {children}
      {subtitle && <div className="mt-2">{subtitle}</div>}
    </fieldset>
  );
}
