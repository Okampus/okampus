import { clsx } from 'clsx';
import { motion } from 'framer-motion';

type TabButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  backgroundColor?: string;
  className?: string;
};

export function TabButton({ children, onClick, active = false, backgroundColor = '#000', className }: TabButtonProps) {
  return (
    <motion.button
      onClick={() => onClick?.()}
      whileHover={{ scale: active ? 1 : 1.05 }}
      whileTap={{ scale: active ? 1 : 0.95 }}
      className={clsx(className, !active && 'border border-opacity-20', 'border border-white text-white m-0.5 button')}
      style={{ backgroundColor }}
    >
      {children}
    </motion.button>
  );
}
