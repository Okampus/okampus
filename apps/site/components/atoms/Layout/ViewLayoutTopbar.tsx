'use client';

import Skeleton from '../Skeleton/Skeleton';

import { isSidePanelOpenAtom, isSidebarOpenAtom } from '../../../context/global';
import { useCurrentBreakpoint } from '../../../hooks/useCurrentBreakpoint';

import { IconMenu2, IconUsers } from '@tabler/icons-react';

import clsx from 'clsx';
import { useAtom } from 'jotai';

export type ViewLayoutTopbarProps = {
  header?: string | null;
  headerPrefix?: React.ReactNode;
  headerPrefixSmall?: React.ReactNode;
  actions?: React.ReactNode[];
  actionsSmall?: React.ReactNode[];
  sidePanelIcon?: React.ReactNode;
};

export default function ViewLayoutTopbar({
  header,
  headerPrefix,
  headerPrefixSmall,
  actions,
  actionsSmall,
  sidePanelIcon = <IconUsers />,
}: ViewLayoutTopbarProps) {
  const [isSidebarOpen, setIsSideBarOpen] = useAtom(isSidebarOpenAtom);
  const [isSidePanelOpen, setIsSidePanelOpen] = useAtom(isSidePanelOpenAtom);

  const currentWindowSize = useCurrentBreakpoint();

  const isMobile = currentWindowSize === 'mobile';

  const displayedActions = isMobile ? actionsSmall : actions;

  const title = header ? (
    <h1 className="page-title line-clamp-1">{header}</h1>
  ) : header === null ? (
    <Skeleton className="w-48 h-6 md:h-12" />
  ) : null;

  const className = clsx(
    'flex justify-between gap-8 w-full px-[var(--px-content)] min-h-[var(--h-topbar)] z-20 border-color-1',
    'md-max:border-b md-max:sticky md-max:items-center md-max:top-0 md-max:bg-[var(--bg-main)]',
    'md:items-start md:mb-10 md:pt-[var(--py-content)]',
  );

  return (
    <nav className={className}>
      <div className="flex items-center gap-6">
        <button className="md:hidden" onClick={() => setIsSideBarOpen(!isSidebarOpen)}>
          <IconMenu2 />
        </button>
        <div className="flex items-center gap-4">
          {headerPrefix && (isMobile ? headerPrefixSmall ?? headerPrefix : headerPrefix)}
          {title}
        </div>
      </div>
      {(displayedActions?.length || sidePanelIcon) && (
        <div className="flex items-center gap-6">
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
