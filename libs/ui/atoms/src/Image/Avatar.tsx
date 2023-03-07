import { getColorHexFromData } from '@okampus/shared/utils';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

import type { AnimationProps } from 'framer-motion';

export type AvatarProps = {
  src?: string;
  name?: string;
  size?: number | 'full';
  rounded: number;
  className?: string;
  active?: boolean;
  layout?: boolean;
  transition?: AnimationProps['transition'];
};

export function Avatar({ src, name, size = 14, rounded, className, active, transition, layout = false }: AvatarProps) {
  name = name ?? '?';
  return (
    <motion.div
      layout={layout}
      transition={transition}
      className={clsx('flex items-center overflow-hidden shrink-0 font-title', className, active && 'ring-4')}
      style={{
        width: size === 'full' ? '100%' : `${size / 6}rem`,
        height: size === 'full' ? '100%' : `${size / 6}rem`,
        borderRadius: `${rounded}%`,
        fontSize: size === 'full' ? '150%' : `${size / 12}rem`,
      }}
    >
      {src ? (
        <img src={src} alt={`${name}`} />
      ) : (
        <div
          className="flex items-center justify-center w-full h-full"
          style={{ backgroundColor: getColorHexFromData(name) }}
        >
          <span className="font-medium text-white">{name[0]}</span>
        </div>
      )}
    </motion.div>
  );
}
