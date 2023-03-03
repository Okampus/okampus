import { getColorHexFromData } from '@okampus/shared/utils';
import { clsx } from 'clsx';

export type BannerProps = {
  src?: string;
  name?: string;
  rounded?: number;
  className?: string;
};

export function Banner({ src, name, rounded, className }: BannerProps) {
  name = name || '?';
  className = clsx(className, 'w-full aspect-[2/1]');
  if (!src)
    return (
      <div className={className} style={{ backgroundColor: getColorHexFromData(name), borderRadius: `${rounded}%` }} />
    );
  return (
    <img src={src} alt={name} className={clsx(className, 'object-cover')} style={{ borderRadius: `${rounded}%` }} />
  );
}
