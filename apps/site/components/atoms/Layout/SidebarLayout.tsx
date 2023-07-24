'use client';

import { useCurrentBreakpoint } from '../../../hooks/useCurrentBreakpoint';
import { IconArrowLeft, IconX } from '@tabler/icons-react';
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

  return (
    <section
      className={clsx(
        'grid h-full w-full overflow-hidden',
        className,
        currentWindowSize !== 'mobile' && 'grid-cols-[22rem_1fr]',
        showTopBorder && 'border-t border-color-3'
      )}
    >
      <div className="h-full flex flex-col overflow-hidden">{sidebar}</div>
      {currentWindowSize === 'mobile' ? (
        content && (
          <div className="fixed inset-0 flex flex-col bg-main z-50">
            <div className="w-full h-[var(--h-topbar)] flex items-center gap-8 px-[var(--px-content)] font-semibold text-0 bg-0">
              <IconArrowLeft className="w-7 h-7 cursor-pointer" onClick={closeContent} />
              {contentHeader}
            </div>
            {content}
          </div>
        )
      ) : (
        <div
          className={clsx(
            'flex flex-col',
            showBetweenBorder && 'border-l border-color-3',
            contentScrollable && 'overflow-y-scroll overflow-x-hidden scrollbar'
          )}
        >
          {content ? (
            <div className="flex flex-col gap-2">
              <div className="w-full h-[var(--h-topbar)] flex items-center justify-between font-semibold px-6 bg-0">
                {contentHeader}
                <IconX className="w-6 h-6 cursor-pointer shrink-0" onClick={closeContent} />
              </div>
              {content}
            </div>
          ) : (
            <div className="my-auto">{emptyState}</div>
          )}
        </div>
      )}
    </section>
  );
}