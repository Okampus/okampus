import { CloseButton } from '../Icon/CloseButton';
import { NavigationContext } from '@okampus/ui/hooks';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useContext } from 'react';

export type ModalProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  noPadding?: boolean;
  onClose?: () => void;
};
export function Modal({ children, footer, header, noPadding, onClose }: ModalProps) {
  const { hideOverlay } = useContext(NavigationContext);

  const modalBaseClass = 'relative flex flex-col';
  const modalSmallClass = 'md-max:h-full md-max:w-full';
  const modalLargeClass = 'md:my-10 md:overflow-hidden md:rounded-md md:min-w-[38rem]';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.2 }}
      onClick={(e) => e.stopPropagation()}
      className={clsx(modalBaseClass, modalSmallClass, modalLargeClass)}
    >
      <div className="min-h-[var(--topbar-height)] flex justify-center p-5 bg-1">
        <div className="title px-16 text-center">{header}</div>
        <CloseButton className="absolute right-5 top-4" onClick={() => (hideOverlay(), onClose?.())} />
      </div>
      <div
        className={clsx('min-h-0 bg-1 overflow-y-scroll overflow-x-hidden scrollbar', !noPadding && 'px-7 pt-3 pb-8')}
      >
        {children}
      </div>
      {footer && <div className="shrink-0 bg-3 py-5 px-7">{footer}</div>}
    </motion.div>
  );
}
