import { HeadingSeparated } from '../Heading/HeadingSeparated';
import { motion } from 'framer-motion';

type SideModalProps = {
  title?: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
  onHide?: () => void;
};

export function Modal({ title, children }: SideModalProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.6, opacity: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.2 }}
      className="relative max-h-[80vh]"
    >
      <div
        className="bg-2 rounded-lg z-[101] px-8 py-6 flex flex-col gap-6 min-w-[34rem] max-h-full scrollbar"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      >
        {HeadingSeparated({ title })}
        <div className="text-base">{children}</div>
      </div>
    </motion.div>
  );
}
