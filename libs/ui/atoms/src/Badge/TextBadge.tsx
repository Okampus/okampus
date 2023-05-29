export type TextBadgeProps = { color?: string; label: string; prefix?: React.ReactNode };
export function TextBadge({ color = 'darkred', label, prefix }: TextBadgeProps) {
  return (
    <span className="px-2 background rounded w-fit text-base inline-flex gap-1" style={{ backgroundColor: color }}>
      {prefix}
      <span className="text-white font-medium text-sm">{label}</span>
    </span>
  );
}
