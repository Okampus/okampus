import clsx from 'clsx';

export type ViewLayoutProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
  bottomPadded?: boolean;
};
export default function ViewLayout({
  header,
  children,
  className,
  scrollable = true,
  bottomPadded = true,
}: ViewLayoutProps) {
  return (
    <section
      className={clsx(
        'w-full min-w-0 h-full px-[var(--px-content)] pt-[var(--py-content)] flex flex-col',
        className,
        scrollable && 'overflow-y-scroll overflow-x-hidden scrollbar',
        bottomPadded && 'pb-[var(--pb-app)]'
      )}
    >
      {header && <div className="page-title mb-10">{header}</div>}
      {children}
    </section>
  );
}
