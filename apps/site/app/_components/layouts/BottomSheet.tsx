'use client';

import Button from '../molecules/Button/Button';
import CloseButtonIcon from '../atoms/Icon/CloseButtonIcon';

import { useBottomSheet } from '../../_hooks/context/useBottomSheet';

import { AnimatePresence, motion } from 'framer-motion';
import { useKeyPressEvent } from 'react-use';

export default function BottomSheet() {
  const { bottomSheet, closeBottomSheet, isBottomSheetOpen } = useBottomSheet();
  useKeyPressEvent('Escape', closeBottomSheet);

  return (
    <AnimatePresence>
      {isBottomSheetOpen && (
        <motion.div
          initial={{ y: '50%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '50%', opacity: 0 }}
          transition={{ ease: 'easeInOut', duration: 0.2 }}
          className="h-screen absolute inset-0 flex flex-col overflow-hidden z-50"
        >
          <div className="shrink-0 h-[var(--h-topbar)] w-full bg-1 flex pl-[var(--px-content)] pr-2 items-center justify-between">
            {bottomSheet.header}
            <div className="flex items-center gap-6">
              {bottomSheet.buttons?.map((button, idx) => <Button key={idx} {...button} />)}
              <CloseButtonIcon onClick={() => (closeBottomSheet(), bottomSheet.onClose?.())} />
            </div>
          </div>
          <div className="grow min-h-0 bg-main flex flex-col px-[var(--px-content)]">{bottomSheet.node}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
