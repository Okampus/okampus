'use client';

export type RenderErrorsProps = { errors: string[] };
export default function RenderErrors({ errors }: RenderErrorsProps) {
  return errors.length > 1 ? (
    errors.map((error) => (
      <p key={error} aria-live="polite">
        • {error}
      </p>
    ))
  ) : errors.length === 1 ? (
    <p aria-live="polite">{errors[0]}</p>
  ) : null;
}
