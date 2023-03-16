import { getColorHexFromData } from '@okampus/shared/utils';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

import type { AnimationProps } from 'framer-motion';

export type AvatarProps = {
  src?: string;
  name?: string;
  size?: number;
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
      className={clsx(
        'flex items-center overflow-hidden shrink-0 font-heading leading-none',
        className,
        active && 'ring-4'
      )}
      style={{
        width: `${size / 6}rem`,
        height: `${size / 6}rem`,
        borderRadius: `${rounded}%`,
        fontSize: `${size / 10}rem`,
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
