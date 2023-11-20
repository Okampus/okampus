'use client';

import CloseButtonIcon from '../atoms/Icon/CloseButtonIcon';
import Backdrop from '../atoms/Layout/Backdrop';

import Button from '../molecules/Button/Button';

import { useModal } from '../../_hooks/context/useModal';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

export default function Modal() {
  const { modals, closeModal, isModalOpen } = useModal();

  const modalBaseClass = 'relative flex flex-col bg-[var(--bg-main)] overflow-y-auto scrollbar p-10';
  const modalSmallClass = 'md-max:h-full md-max:w-full short:h-full short:w-full';
  const modalLargeClass =
    'md:tall:my-14 md:tall:overflow-hidden md:tall:rounded-2xl md:tall:border md:tall:border-[var(--border-2)]';

  const currentModal = modals.at(-1);
  const onClose = () => {
    closeModal();
    currentModal?.onClose?.();
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <Backdrop className="flex flex-col items-center justify-center z-[200]" onMouseDown={onClose}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ ease: 'easeInOut', duration: 0.2 }}
            onMouseDown={(event) => event.stopPropagation()}
            className={clsx(modalBaseClass, modalSmallClass, modalLargeClass)}
          >
            <CloseButtonIcon className="absolute right-2 top-2" onClick={onClose} />
            {modals.map((modal, idx) => (
              <section key={idx} className={clsx(idx !== modals.length - 1 && 'hidden')}>
                {modal.header && (
                  <header className="shrink-0 min-h-[var(--topbar-height)] font-bold text-3xl text-[var(--text-0)]">
                    {modal.header}
                  </header>
                )}
                {modal.description && <h2 className="text-2 pt-4">{modal.description}</h2>}
                <main className="pt-6">{modal.node}</main>
                {modal.buttons && (
                  <footer className="shrink-0 min-h-[var(--topbar-height)] flex items-center md:tall:self-end gap-6 p-6">
                    {modal.buttons.map((button, idx) => (
                      <Button key={idx} {...button} />
                    ))}
                  </footer>
                )}
              </section>
            ))}
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
