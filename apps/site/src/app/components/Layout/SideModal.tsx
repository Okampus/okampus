import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/close.svg';
import { motion } from 'framer-motion';

type SideModalProps = {
  children: React.ReactNode | React.ReactNode[];
  hideButtonModal: () => void;
};
export function SideModal({ children, hideButtonModal }: SideModalProps) {
  return (
    <motion.div
      onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.2 }}
    >
      <div className="p-6 h-full w-96 bg-blue-500 z-[101] rounded-l-lg gap-8 flex flex-col">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-medium">Créer un événement</span>
          <button onClick={hideButtonModal}>
            <CloseIcon height={36} />
          </button>
        </div>
        <div className="text-base">{children}</div>
      </div>
    </motion.div>
  );
}
