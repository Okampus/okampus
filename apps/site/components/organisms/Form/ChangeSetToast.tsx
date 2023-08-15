'use client';

import ActionButton from '../../molecules/Button/ActionButton';
import { AnimatePresence, motion } from 'framer-motion';

import type { NestedKeyOf } from '@okampus/shared/types';

export type ChangeSetToastProps<T extends Record<string, unknown>> = {
  changed: boolean;
  errors?: Record<string, unknown>;
  loading?: NestedKeyOf<T>[];
  onCancel: () => void;
};

export default function ChangeSetToast<T extends Record<string, unknown>>({
  changed,
  errors = {},
  loading = [],
  onCancel,
}: ChangeSetToastProps<T>) {
  return (
    <AnimatePresence>
      {changed && !Object.values(errors).some(Boolean) && loading.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed z-[100] left-0 md:left-1/2 md:-translate-x-1/2 md-max:w-screen md-max:bottom-[var(--h-bottombar)] bottom-4 md:rounded-xl flex justify-between items-center font-semibold md:gap-20 pl-6 pr-4 py-2.5 bg-opposite text-opposite"
        >
          <div className="shrink-0 text-lg">Sauvegarder ?</div>
          <div className="flex gap-4 shrink-0">
            <ActionButton action={{ label: 'Annuler', linkOrActionOrMenu: onCancel }} className="text-opposite" />
            <input type="submit" className="button bg-[var(--success)] text-white" value="Sauvegarder" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
