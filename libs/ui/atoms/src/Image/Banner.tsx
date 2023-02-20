import { getColorHexFromData } from '@okampus/shared/utils';
import { clsx } from 'clsx';

export type BannerProps = {
  src?: string;
  name?: string;
  className?: string;
};

export function Banner({ src, name, className }: BannerProps) {
  name = name || '?';
  className = clsx(className, 'rounded-xl w-full aspect-[16/10]');
  if (!src) return <div className={className} style={{ backgroundColor: getColorHexFromData(name) }} />;
  return <img src={src} alt={name} className={clsx(className, 'object-cover')} />;
}
