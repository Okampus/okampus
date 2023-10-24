import { CircleNotch } from '@phosphor-icons/react/dist/ssr';

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
      <div className="text-[var(--info)] flex gap-2">
        <CircleNotch className="animate-spin shrink-0 h-5 w-5 pt-1" />
        Vérification...
      </div>
    );
  else if (error) subtitle = <div className="text-[var(--danger)] text-sm font-medium">{error}</div>;

  return (
    <fieldset className={className}>
      {label && (
        <legend className="label-title mb-2">
          {label} {required && <span className="text-[var(--danger)]">*</span>}
        </legend>
      )}
      {description && <div className="text-2 mb-2">{description}</div>}
      {children}
      {subtitle && <div className="mt-2">{subtitle}</div>}
    </fieldset>
  );
}
