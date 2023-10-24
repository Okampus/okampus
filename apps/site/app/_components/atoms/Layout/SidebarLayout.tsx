'use client';

import { useCurrentBreakpoint } from '../../../_hooks/useCurrentBreakpoint';
import { ArrowLeft, X } from '@phosphor-icons/react';
import clsx from 'clsx';

export type SidebarLayoutProps = {
  sidebar: React.ReactNode;
  emptyState?: React.ReactNode;
  content?: React.ReactNode;
  contentHeader?: React.ReactNode;
  closeContent: () => void;
  className?: string;
  showTopBorder?: boolean;
  showBetweenBorder?: boolean;
  sidebarScrollable?: boolean;
  contentScrollable?: boolean;
};
export default function SidebarLayout({
  sidebar,
  emptyState,
  content,
  contentHeader,
  closeContent,
  className,
  showTopBorder = true,
  showBetweenBorder = true,
  contentScrollable = false,
}: SidebarLayoutProps) {
  const currentWindowSize = useCurrentBreakpoint();
  const isSmall = currentWindowSize === 'mobile' || currentWindowSize === 'tablet';

  return (
    <section className={clsx('grid h-full w-full overflow-hidden', className, !isSmall && 'grid-cols-[22rem_1fr]')}>
      <div
        className={clsx('h-full flex flex-col overflow-hidden', showTopBorder && 'border-t border-[var(--border-3)]')}
      >
        {sidebar}
      </div>
      {isSmall ? (
        content && (
          <div className="fixed inset-0 flex flex-col bg-main z-50">
            <div className="w-full h-[var(--h-topbar)] flex items-center gap-8 px-[var(--px-content)] font-semibold text-0 bg-0">
              <ArrowLeft className="w-7 h-7 cursor-pointer" onClick={closeContent} />
              {contentHeader}
            </div>
            {content}
          </div>
        )
      ) : (
        <div
          className={clsx(
            'flex flex-col',
            showBetweenBorder && 'border-l border-[var(--border-3)]',
            contentScrollable && 'overflow-y-scroll overflow-x-hidden scrollbar',
            showTopBorder && 'border-t border-[var(--border-3)]',
          )}
        >
          {content ? (
            <div className="flex flex-col gap-2">
              <div className="w-full h-[var(--h-topbar)] flex items-center justify-between font-semibold px-6 bg-0">
                {contentHeader}
                <X className="w-6 h-6 cursor-pointer shrink-0" onClick={closeContent} />
              </div>
              {content}
            </div>
          ) : (
            <div className="my-auto flex items-center justify-center">{emptyState}</div>
          )}
        </div>
      )}
    </section>
  );
}
