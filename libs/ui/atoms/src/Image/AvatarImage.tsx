import { Skeleton } from '../Skeleton/Skeleton';
import { getColorHexFromData } from '@okampus/shared/utils';
import { clsx } from 'clsx';

import type { AnimationProps } from 'framer-motion';
import type { CSSLengthUnit } from '@okampus/shared/types';

export type AvatarImageProps = {
  src?: string;
  name?: string;
  size?: number;
  sizeUnit?: CSSLengthUnit;
  rounded: number;
  className?: string;
  active?: boolean;
  layout?: boolean;
  transition?: AnimationProps['transition'];
};

export function AvatarImage({ src, name, size = 12, rounded, className, active }: AvatarImageProps) {
  return name ? (
    <div
      className={clsx('flex items-center overflow-hidden shrink-0 leading-none', active && 'ring-4', className)}
      style={{
        height: `${size / 6}rem`,
        aspectRatio: '1/1',
        fontSize: `${size / 10}rem`,
        borderRadius: `${rounded}%`,
      }}
    >
      {src ? (
        <img src={src} alt={`${name}`} />
      ) : (
        <div
          className="flex items-center justify-center w-full h-full font-medium text-white"
          style={{ backgroundColor: getColorHexFromData(name) }}
        >
          {name[0]}
        </div>
      )}
    </div>
  ) : (
    <Skeleton width={size} ratio={1} rounded="100%" />
  );
}
