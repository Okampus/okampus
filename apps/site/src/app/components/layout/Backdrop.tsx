import { fuseClasses } from '@okampus/shared/utils';
import { motion } from 'framer-motion';

type BackdropProps = {
  children: React.ReactNode | React.ReactNode[];
  onClick: () => void;
  classes?: string;
};
export const Backdrop = ({ children, onClick, classes }: BackdropProps) => {
  return (
    <motion.div
      className={fuseClasses(
        'absolute top-0 left-0 w-full h-full bg-black bg-[#000000e1] z-[100] flex overflow-hidden',
        classes
      )}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};