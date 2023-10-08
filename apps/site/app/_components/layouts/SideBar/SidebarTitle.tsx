import clsx from 'clsx';

export type SideBarTitleProps = { children: React.ReactNode; className?: string; separator?: boolean };
export default function SideBarTitle({ children, className, separator = true }: SideBarTitleProps) {
  const titleClassName = clsx(
    className,
    'px-4 w-full line-clamp-1 text-0 font-semibold text-xl flex items-center h-[var(--h-topbar)] shrink-0',
    separator && 'border-b border-[var(--border-2)] mb-3',
  );
  return <div className={titleClassName}>{children}</div>;
}
