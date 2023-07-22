'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';

type BackdropProps = { children: React.ReactNode; className?: string; onClick?: () => void };
export default function Backdrop({ className, children, onClick }: BackdropProps) {
  const backdropClass = clsx(className, 'h-screen absolute inset-0 bg-[#000000bb] z-[100] flex overflow-hidden');
  const initial = { opacity: 0 };
  const animate = { opacity: 1 };

  return (
    <motion.section
      className={backdropClass}
      onClick={onClick}
      initial={initial}
      animate={animate}
      exit={initial}
      transition={{ ease: 'easeInOut', duration: 0.3 }}
    >
      {children}
    </motion.section>
  );
}
