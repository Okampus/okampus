'use client';

import Backdrop from '../atoms/Layout/Backdrop';
import { isSidePanelOpenAtom } from '../../_context/global';
import { useCurrentBreakpoint } from '../../_hooks/useCurrentBreakpoint';

import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

// const initial = { x: 'var(--w-sidepanel)', width: 0 };
// const animate = { x: 0, width: 'var(--w-sidepanel)' };
// const transition = { ease: 'easeInOut', duration: 0.3 };

export type SidePanelProps = { children: React.ReactNode };
export default function SidePanel({ children }: SidePanelProps) {
  const [isSidePanelOpen, setIsSidePanelOpen] = useAtom(isSidePanelOpenAtom);
  const currentWindowSize = useCurrentBreakpoint();

  const isSmall = currentWindowSize !== 'desktopXl';

  useEffect(() => {
    if (!isSmall) setIsSidePanelOpen(true);
  }, [isSmall, setIsSidePanelOpen]);

  useEffect(() => {
    if (isSmall) setIsSidePanelOpen(false);
  }, [isSmall, setIsSidePanelOpen]);

  const sidePanelClass = clsx(
    'h-full shrink-0 bg-[var(--bg-sidebar)] w-[var(--w-sidepanel)] overflow-x-hidden rounded-l-md',
    currentWindowSize === 'desktopXl' ? 'relative' : 'absolute top-0 right-0',
  );
  const slidingSidePanel = (
    <nav
      // initial={initial} animate={animate} exit={initial} transition={transition}
      className={sidePanelClass}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </nav>
  );

  return (
    <AnimatePresence>
      {isSidePanelOpen &&
        children &&
        (currentWindowSize === 'desktopXl' ? (
          slidingSidePanel
        ) : (
          <Backdrop onClick={() => setIsSidePanelOpen(false)}>{slidingSidePanel}</Backdrop>
        ))}
    </AnimatePresence>
  );
}