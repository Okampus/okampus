import clsx from 'clsx';

export type SidebarTitleProps = { children: React.ReactNode; className?: string; separator?: boolean };
export default function SidebarTitle({ children, className = 'text-0', separator = true }: SidebarTitleProps) {
  const titleClassName = clsx(
    className,
    'font-semibold text-ellipsis text-xl whitespace-nowrap overflow-hidden min-w-0',
  );
  return (
    <div
      className={clsx(
        'px-7 w-full flex items-center shrink-0 h-[var(--h-topbar)]',
        separator && 'border-b border-[var(--border-1)] mb-3',
      )}
    >
      <div className={titleClassName}>{children}</div>
    </div>
  );
}
