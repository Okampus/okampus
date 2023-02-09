// import { useContext } from 'react';
// import { NavigationContext } from '../../../../../apps/site/src/app/context/NavigationContext';
// import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/close.svg';
import { HeadingSeparated } from '../Heading/HeadingSeparated';
import { motion } from 'framer-motion';
// import { clsx } from 'clsx';

type SideModalProps = {
  title?: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
  onHide?: () => void;
};

export function Modal({ title, children }: SideModalProps) {
  // const { hideModal } = useContext(NavigationContext);
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.6, opacity: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.2 }}
      className="relative max-h-[80vh] overflow-scroll"
    >
      <div
        className="bg-2 rounded-lg z-[101] px-8 py-6 flex flex-col gap-6 min-w-[34rem] max-h-full overflow-scroll scrollbar"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      >
        {HeadingSeparated({ title })}
        <div className="text-base">{children}</div>
      </div>
    </motion.div>
  );
}
