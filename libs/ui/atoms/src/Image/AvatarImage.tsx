import { Skeleton } from '../Skeleton/Skeleton';
import { getColorHexFromData } from '@okampus/shared/utils';
import clsx from 'clsx';

import type { AnimationProps } from 'framer-motion';
import type { CSSLengthUnit } from '@okampus/shared/types';

export type AvatarImageProps = {
  src?: string;
  name?: string;
  size?: number;
  sizeUnit?: CSSLengthUnit;
  className?: string;
  type?: 'user' | 'team' | 'tenant';
  active?: boolean;
  layout?: boolean;
  transition?: AnimationProps['transition'];
};

const avatarBackgroundClass = 'flex items-center justify-center w-full h-full font-medium text-white';
export function AvatarImage({ src, name, size = 12, className, active, type }: AvatarImageProps) {
  const roundedStyle = type
    ? { borderRadius: type === 'user' ? '50%' : type === 'team' ? '25%' : type === 'tenant' ? '5%' : 0 }
    : {};
  className = clsx('flex items-center overflow-hidden shrink-0 leading-none', active && 'ring-4', className);
  if (!name) return <Skeleton width={size} ratio={1} style={roundedStyle} />;

  const style = { height: `${size / 6}rem`, aspectRatio: '1/1', fontSize: `${size / 10}rem`, ...roundedStyle };
  return (
    <div className={className} style={style}>
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <div className={avatarBackgroundClass} style={{ backgroundColor: getColorHexFromData(name) }}>
          {name[0]}
        </div>
      )}
    </div>
  );
}
