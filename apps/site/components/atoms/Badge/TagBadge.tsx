import clsx from 'clsx';

export type TagBadgeProps = {
  label: string;
  count?: number;
  onClick?: () => void;
  className?: string | boolean;
  backgroundClass?: string;
  slug?: string;
};

export default function TagBadge({
  label,
  count,
  className,
  onClick,
  // slug, // TODO: add slug to link to tag page
  backgroundClass = 'bg-4',
}: TagBadgeProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'py-1.5 px-3 w-fit capitalize contrast-125 text-1 flex gap-2 items-center text-sm font-semibold cursor-pointer',
        className,
        backgroundClass,
      )}
    >
      <span>{label}</span>
      {count ? <span className="text-2 text-3-hover">{count}</span> : null}
    </div>
  );
}
