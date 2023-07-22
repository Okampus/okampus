'use client';

import Backdrop from '../atoms/Layout/Backdrop';
import { isSidePanelOpenAtom } from '../../context/global';
import { useCurrentBreakpoint } from '../../hooks/useCurrentBreakpoint';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAtom } from 'jotai';

const initial = { x: 'var(--w-sidepanel)', width: 0 };
const animate = { x: 0, width: 'var(--w-sidepanel)' };
const transition = { ease: 'easeInOut', duration: 0.3 };

export type SidePanelProps = { children: React.ReactNode };
export default function SidePanel({ children }: SidePanelProps) {
  const [isSidePanelOpen, setIsSidePanelOpen] = useAtom(isSidePanelOpenAtom);
  const currentWindowSize = useCurrentBreakpoint();

  useEffect(() => {
    if (currentWindowSize === 'desktopXl') {
      !isSidePanelOpen && setIsSidePanelOpen(true);
    } else {
      isSidePanelOpen && setIsSidePanelOpen(false);
    }
  }, [currentWindowSize, isSidePanelOpen, setIsSidePanelOpen]);

  const sidePanelClass = clsx(
    'h-full shrink-0 bg-1 w-[var(--w-sidepanel)] overflow-x-hidden',
    currentWindowSize === 'desktopXl' ? 'relative' : 'absolute top-0 right-0'
  );
  const slidingSidePanel = (
    <motion.nav
      // initial={initial} animate={animate} exit={initial} transition={transition}
      className={sidePanelClass}
    >
      {children}
    </motion.nav>
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
