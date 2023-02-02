import { motion } from 'framer-motion';

import { clsx } from 'clsx';
type BackdropProps = {
  children: React.ReactNode | React.ReactNode[];
  onClick: () => void;
  classes?: string;
};
export const Backdrop = ({ children, onClick, classes }: BackdropProps) => {
  return (
    <motion.div
      className={clsx('backdrop', classes)}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};
