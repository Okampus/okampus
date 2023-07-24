export type TextBadgeProps = { color?: string; label: string; prefix?: React.ReactNode };
export default function TextBadge({ color = '#ff1155', label, prefix }: TextBadgeProps) {
  return (
    <span className="px-2 background rounded w-fit text-base inline-flex gap-1" style={{ backgroundColor: color }}>
      {prefix}
      <span className="text-white font-semibold text-[0.85rem]">{label}</span>
    </span>
  );
}
