import './Skeleton.scss';
import clsx from 'clsx';

export type SkeletonProps = {
  width?: number | 'full';
  height?: number | 'full';
  ratio?: number;
};

export function Skeleton({ width, height, ratio, ...props }: React.HTMLProps<HTMLDivElement> & SkeletonProps) {
  const { className, style, ...rest } = props;
  if (style) style.borderRadius = style.borderRadius ?? '0.25rem';

  return (
    <div
      className={clsx('skeleton-loader', className)}
      style={{
        ...(width && { width: width === 'full' ? '100%' : `${width / 6}rem` }),
        ...(ratio ? { aspectRatio: ratio } : height && { height: height === 'full' ? '100%' : `${height / 6}rem` }),
        ...style,
      }}
      {...rest}
    />
  );
}
