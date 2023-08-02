'use client';

import { isSidePanelOpenAtom, isSidebarOpenAtom } from '../../../context/global';
import { useCurrentBreakpoint } from '../../../hooks/useCurrentBreakpoint';
import { IconMenu2, IconUsers } from '@tabler/icons-react';
import clsx from 'clsx';
import { useAtom } from 'jotai';

export type ViewLayoutTopbarProps = {
  header?: React.ReactNode;
  headerSmall?: React.ReactNode;
  actions?: React.ReactNode[];
  actionsSmall?: React.ReactNode[];
  sidePanelIcon?: React.ReactNode;
};

export default function ViewLayoutTopbar({
  header,
  headerSmall,
  actions,
  actionsSmall,
  sidePanelIcon = <IconUsers />,
}: ViewLayoutTopbarProps) {
  const [isSidebarOpen, setIsSideBarOpen] = useAtom(isSidebarOpenAtom);
  const [isSidePanelOpen, setIsSidePanelOpen] = useAtom(isSidePanelOpenAtom);

  const currentWindowSize = useCurrentBreakpoint();

  const isMobile = currentWindowSize === 'mobile';

  const displayedActions = isMobile ? actionsSmall ?? actions : actions;
  const displayedHeader = isMobile ? headerSmall ?? header : header;

  const isTitle = typeof displayedHeader !== 'function' && typeof displayedHeader !== 'object';

  let inner = displayedHeader;
  if (isTitle)
    inner = isMobile ? (
      <h1 className="text-xl font-semibold text-0 line-clamp-1">{displayedHeader}</h1>
    ) : (
      <h1 className="page-title line-clamp-1">{displayedHeader}</h1>
    );

  const className = clsx(
    'flex items-start justify-between gap-8 w-full px-[var(--px-content)]',
    isMobile ? 'py-3 mb-4 border-b border-color-2 sticky top-0 bg-main z-20' : 'mb-10 pt-[var(--py-content)]'
  );

  return (
    <nav className={className}>
      <div className="flex items-center gap-4">
        {isMobile && (
          <button onClick={() => setIsSideBarOpen(!isSidebarOpen)}>
            <IconMenu2 />
          </button>
        )}
        {inner}
      </div>
      {(displayedActions?.length || sidePanelIcon) && (
        <div className="flex items-center gap-4">
          {displayedActions}
          <button
            className={isSidePanelOpen ? 'text-0' : 'text-3'}
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          >
            {sidePanelIcon}
          </button>
        </div>
      )}
    </nav>
  );
}
