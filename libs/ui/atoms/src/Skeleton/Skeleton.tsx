import './Skeleton.scss';
import { clsx } from 'clsx';

export type SkeletonProps = {
  rounded?: string;
  width?: number | 'full';
  height?: number | 'full';
  ratio?: number;
  className?: string;
};

export function Skeleton({ rounded = '0.25rem', width, height, ratio, className }: SkeletonProps) {
  return (
    <div
      className={clsx('skeleton-loader', className)}
      style={{
        ...(width && { width: width === 'full' ? '100%' : `${width / 6}rem` }),
        ...(ratio ? { aspectRatio: ratio } : height && { height: height === 'full' ? '100%' : `${height / 6}rem` }),
        borderRadius: rounded,
      }}
    />
  );
}
