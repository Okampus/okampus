import ViewLayoutTopbar from './ViewLayoutTopbar';
import clsx from 'clsx';

import type { ViewLayoutTopbarProps } from './ViewLayoutTopbar';

export type ViewLayoutProps = {
  children: React.ReactNode;
  innerClassName?: string;
  scrollable?: boolean;
  bottomPadded?: boolean;
  mobilePadded?: boolean;
  horizontalPadding?: boolean;
} & ViewLayoutTopbarProps;
export default function ViewLayout({
  children,
  innerClassName,
  scrollable = true,
  bottomPadded = true,
  mobilePadded = true,
  horizontalPadding = true,
  ...topbarProps
}: ViewLayoutProps) {
  return (
    <section
      className={clsx(
        'w-full min-w-0 h-full flex flex-col md-max:[&>:nth-child(2)]:pt-4 md-max:[&>:nth-child(2)]:mb-[var(--h-bottombar)]',
        scrollable &&
          'overflow-y-scroll overflow-x-hidden md-max:!overflow-hidden md-max:[&>:nth-child(2)]:overflow-y-auto',
      )}
    >
      <ViewLayoutTopbar {...topbarProps} />
      <div
        className={clsx(
          'h-full min-h-0',
          bottomPadded && '[&>:last-child]:pb-[var(--pb-app)]',
          horizontalPadding && (mobilePadded ? 'px-[var(--px-content)]' : 'md:px-[var(--px-content)]'),
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
