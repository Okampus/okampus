export type TextBadgeProps = { color?: string; children: React.ReactNode; prefix?: React.ReactNode };
export default function TextBadge({ color = 'var(--primary)', children, prefix }: TextBadgeProps) {
  return (
    <span
      className="px-2 rounded w-fit text-sm inline-flex gap-1 items-center border border-[var(--border-0)]"
      style={{
        color,
        background: color.startsWith('var(') ? `rgba(${color},0.2)` : `${color}20`,
      }}
    >
      {prefix}
      <span className="font-medium">{children}</span>
    </span>
  );
}
