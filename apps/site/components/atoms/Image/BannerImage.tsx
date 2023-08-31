import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { getColorHexFromData } from '@okampus/shared/utils';

import clsx from 'clsx';

export type BannerImageProps = {
  aspectRatio?: number;
  src?: string;
  name?: string;
  rounded?: string;
  className?: string;
  hasBorder?: boolean;
};

export default function BannerImage({
  aspectRatio = BANNER_ASPECT_RATIO,
  src,
  name,
  className,
  hasBorder = true,
}: BannerImageProps) {
  className = clsx(
    className,
    'overflow-hidden shrink-0',
    hasBorder && 'border-2 border-b-4 border-[var(--border-primary)]',
  );
  const style = { aspectRatio };

  if (!src) return <div className={className} style={{ ...style, backgroundColor: getColorHexFromData(name) }} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={name ?? 'Bannière'} className={clsx(className, 'object-cover w-full')} style={style} />;
}
