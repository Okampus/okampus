import { getColorHexFromData } from '@okampus/shared/utils';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useMeasure } from 'react-use';

import type { AnimationProps } from 'framer-motion';
import type { CSSLengthUnit } from '@okampus/shared/types';

export type AvatarProps = {
  src?: string;
  name?: string;
  size?: number | 'inherit';
  sizeUnit?: CSSLengthUnit;
  rounded: number;
  className?: string;
  active?: boolean;
  layout?: boolean;
  transition?: AnimationProps['transition'];
};

export function Avatar({
  src,
  name,
  size = 14,
  sizeUnit = 'rem',
  rounded,
  className,
  active,
  transition,
  layout = false,
}: AvatarProps) {
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  name = name ?? '?';
  return (
    <motion.div
      layout={layout}
      transition={transition}
      className={clsx(
        'flex items-center overflow-hidden shrink-0 font-heading leading-none',
        active && 'ring-4',
        className
      )}
      style={{
        ...(size === 'inherit'
          ? { fontSize: `${height / 1.6}px`, width: `${height}px` }
          : {
              height: `${size / 6}${sizeUnit}`,
              width: `${height}px`,
              fontSize: sizeUnit === '%' ? `${height / 1.6}px` : `${size / 10}${sizeUnit}`,
            }),
        borderRadius: `${rounded}%`,
      }}
    >
      {src ? (
        <img src={src} alt={`${name}`} />
      ) : (
        <div
          ref={ref}
          className="flex items-center justify-center w-full h-full"
          style={{ backgroundColor: getColorHexFromData(name) }}
        >
          <span className="font-medium text-white">{name[0]}</span>
        </div>
      )}
    </motion.div>
  );
}
