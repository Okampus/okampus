import ViewLayoutTopbar from './ViewLayoutTopbar';
import clsx from 'clsx';

import type { ViewLayoutTopbarProps } from './ViewLayoutTopbar';

export type ViewLayoutProps = {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
  bottomPadded?: boolean;
} & ViewLayoutTopbarProps;
export default function ViewLayout({
  children,
  className,
  scrollable = true,
  bottomPadded = true,
  ...topbarProps
}: ViewLayoutProps) {
  return (
    <section
      className={clsx(
        'w-full min-w-0 h-full flex flex-col',
        className,
        scrollable && 'overflow-y-scroll overflow-x-hidden scrollbar',
        bottomPadded && 'pb-[var(--pb-app)]'
      )}
    >
      <ViewLayoutTopbar {...topbarProps} />
      <div className="h-full px-[var(--px-content)]">{children}</div>
    </section>
  );
}
