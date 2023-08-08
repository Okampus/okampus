'use client';

import ActionButton from '../../molecules/Button/ActionButton';

// import { ActionType } from '@okampus/shared/types';
// import { fromEntries } from '@okampus/shared/utils';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import type { NestedKeyOf } from '@okampus/shared/types';

export type ChangeSetToastProps<T extends Record<string, unknown>> = {
  // values: T;
  changed: boolean;
  // changeSet: Set<keyof T>;
  errors: { [key in NestedKeyOf<T>]?: string };
  loading: NestedKeyOf<T>[];
  onCancel: () => void;
};

export default function ChangeSetToast<T extends Record<string, unknown>>({
  // values,
  changed,
  // changeSet,
  errors,
  loading,
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
          className={clsx(
            'left-0 md:left-1/2 md:-translate-x-1/2 md-max:w-screen md-max:bottom-0',
            'fixed z-20 bottom-4 md:rounded-xl flex justify-between items-center font-semibold text-sm text-1 md:gap-20 pl-6 pr-4 py-2.5 bg-2 shadow-2xl'
          )}
        >
          <div className="shrink-0">Sauvegarder ?</div>
          <div className="flex gap-4 shrink-0">
            <ActionButton
              action={{
                label: 'Annuler',
                linkOrActionOrMenu: onCancel,
              }}
            />
            <input type="submit" className="button bg-[var(--success)] text-white" value="Sauvegarder" />
            {/* <ActionButton
              small={true}
              action={{
                label: 'Sauvegarder',
                type: ActionType.Success,
                linkOrActionOrMenu: () => onSubmit(values),
                // onSubmit(fromEntries([...changeSet].map((key) => [key, values[key]])) as Partial<T>),
              }}
            /> */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
