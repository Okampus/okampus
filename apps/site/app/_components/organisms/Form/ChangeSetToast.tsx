'use client';

import Button from '../../molecules/Button/Button';
import SubmitButton from '../../molecules/Form/SubmitButton';
import { AnimatePresence, motion } from 'framer-motion';

import type { NestedKeyOf } from '@okampus/shared/types';

export type ChangeSetToastProps<T extends Record<string, unknown>> = {
  isDirty: boolean;
  isValid?: boolean;
  isLoading?: boolean;
  errors?: Record<string, unknown>;
  loading?: NestedKeyOf<T>[];
  onCancel: () => void;
};

export default function ChangeSetToast<T extends Record<string, unknown>>({
  isDirty,
  isValid,
  isLoading,
  onCancel,
}: ChangeSetToastProps<T>) {
  return (
    <AnimatePresence>
      {isDirty && (isValid === undefined || isValid) && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed z-[100] left-0 md:left-1/2 md:-translate-x-1/2 md-max:w-screen md-max:bottom-[var(--h-bottombar)] bottom-4 md:rounded-lg flex justify-between items-center font-semibold md:gap-20 pl-6 pr-4 py-2.5 bg-[var(--bg-opposite)] text-[var(--text-opposite)]"
        >
          <div className="shrink-0 text-lg">Sauvegarder ?</div>
          <div className="flex gap-4 shrink-0">
            <Button action={onCancel} className="text-opposite">
              Annuler
            </Button>
            <SubmitButton label="Sauvegarder" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
