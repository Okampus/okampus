'use client';

import CloseButtonIcon from '../atoms/Icon/CloseButtonIcon';
import Backdrop from '../atoms/Layout/Backdrop';
import { useModal } from '../../_hooks/context/useModal';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

export default function Modal() {
  const { modals, closeModal, isModalOpen } = useModal();

  const modalBaseClass = 'relative flex flex-col bg-2 overflow-y-auto scrollbar';
  const modalSmallClass = 'md-max:h-full md-max:w-full short:h-full short:w-full';
  const modalLargeClass =
    'md:tall:my-14 md:tall:overflow-hidden md:tall:rounded-2xl md:tall:min-w-[30rem] md:tall:border md:tall:border-[var(--border-2)]';

  const currentModal = modals.at(-1);
  const onClose = () => (closeModal(), currentModal?.onClose?.());

  return (
    <AnimatePresence>
      {isModalOpen && (
        <Backdrop className="flex flex-col items-center justify-center" onMouseDown={onClose}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ ease: 'easeInOut', duration: 0.2 }}
            onMouseDown={(e) => e.stopPropagation()}
            className={clsx(modalBaseClass, modalSmallClass, modalLargeClass)}
          >
            <CloseButtonIcon className="absolute right-4 top-4" onClick={onClose} />
            <>
              {modals.map((modal, idx) => (
                <div key={idx} className={clsx(idx === modals.length - 1 ? '' : 'hidden')}>
                  {modal.node}
                </div>
              ))}
            </>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
