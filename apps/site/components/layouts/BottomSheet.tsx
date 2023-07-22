'use client';

import { useBottomSheet } from '../../hooks/context/useBottomSheet';
import { AnimatePresence, motion } from 'framer-motion';

export default function BottomSheet() {
  const { bottomSheet, isBottomSheetOpen } = useBottomSheet();

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
          {bottomSheet}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
