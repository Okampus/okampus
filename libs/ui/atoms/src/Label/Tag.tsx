import { clsx } from 'clsx';

export type TagItem = {
  label: string;
  count?: number;
  onClick?: () => void;
  className?: string | boolean;
  backgroundClass?: string;
  slug?: string;
};

// TODO: add slug for linking to Tag page
export function Tag({ label, count, className, onClick, backgroundClass = 'bg-4' }: TagItem) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'py-1.5 px-3 rounded-full w-fit capitalize contrast-125 text-1 flex gap-2 items-center text-sm font-semibold cursor-pointer',
        className,
        backgroundClass
      )}
    >
      {/* {backgroundColor && <div className="w-2 h-2" style={{ backgroundColor }} />} */}
      <span>{label}</span>
      {count ? <span className="text-2 text-3-hover">{count}</span> : null}
    </div>
  );
}
