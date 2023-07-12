import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { getColorHexFromData } from '@okampus/shared/utils';
import clsx from 'clsx';

export type BannerImageProps = {
  aspectRatio?: number;
  src?: string;
  name?: string;
  rounded?: string;
  className?: string;
};

export function BannerImage({ aspectRatio = BANNER_ASPECT_RATIO, src, name, className }: BannerImageProps) {
  className = clsx(className, 'overflow-hidden shrink-0');
  name = name || 'Bannière';
  const style = { aspectRatio };

  if (!src) return <div className={className} style={{ ...style, backgroundColor: getColorHexFromData(name) }} />;
  return <img src={src} alt={name} className={clsx(className, 'object-cover')} style={style} />;
}
