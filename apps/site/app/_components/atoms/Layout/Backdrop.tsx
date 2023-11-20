'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';

type BackdropProps = {
  activeElementSelector?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};
export default function Backdrop({
  activeElementSelector,
  children,
  className,
  onClick,
  ...props
}: BackdropProps &
  Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onAnimationStart' | 'onAnimateEnd' | 'onDrag' | 'onDragEnd' | 'onDragStart'
  >) {
  const initial = { opacity: 0 };
  const animate = { opacity: 1 };

  return (
    <motion.div
      className={clsx(className, 'absolute inset-0 bg-[#000000bb] flex overflow-hidden z-30')}
      onClick={() => {
        onClick?.();
        const element = activeElementSelector ? document.querySelector(activeElementSelector) : null;
        element?.classList.toggle('active');
      }}
      initial={initial}
      animate={animate}
      exit={initial}
      transition={{ ease: 'easeInOut', duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
