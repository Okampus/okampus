import type { Variants } from 'framer-motion';

export const transition = { type: 'spring', bounce: 0, duration: 0.4, delayChildren: 0.025, staggerChildren: 0.025 };
export const contentVariants: Variants = {
  open: { height: 'auto', opacity: 1, transformOrigin: 'top', display: 'block', transition },
  closed: { height: 0, opacity: 0.1, transformOrigin: 'bottom', transition },
};

export const itemVariants: Variants = {
  open: { opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  closed: { opacity: 0, transition: { duration: 0.2 } },
};

export const arrowConfig = {
  variants: { open: { rotate: 180, y: '-50%' }, closed: { rotate: 0, y: '-50%' } },
  transition: { duration: 0.2 },
};

export const baseItemClassName = 'cursor-pointer px-3 py-2 text-0 flex justify-between items-center';
export const contentClassName = 'flex flex-col !max-h-[16rem] rounded-md bg-1 text-0 z-20 text-sm font-medium';
export const innerContentClassName = 'py-2 overflow-y-scroll scrollbar min-h-0 max-h-[16rem]';
export const openClassName = 'outline-2 outline outline-offset-1 outline-[var(--border-2)]';
export const searchInputClassName = 'input !pt-0 h-10 !bg-[var(--bg-input)]';
