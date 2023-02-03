import { clsx } from 'clsx';

export type ImageGradientProps = {
  className?: string;
  src?: string;
  bgGradient?: string;
  rounded?: string;
  height?: string;
  children?: React.ReactNode;
  imageClassName?: string;
  onClick?: () => void;
};
// <div className={classNames('image-gradient', className)} style={{ backgroundImage: `url(${src})` }} />
export function ImageGradient({
  onClick,
  className = 'checkered',
  src,
  children,
  bgGradient = 'bg-gradient-to-b from-[#000000bb] via-[#00000022] to-transparent',
  rounded = 'rounded-lg',
  imageClassName,
}: ImageGradientProps) {
  return (
    <div
      onClick={onClick}
      className={clsx('relative w-fit flex items-center justify-center min-w-[10rem]', className, rounded)}
    >
      <img src={src} className={clsx(rounded, imageClassName, 'max-h-40')} />
      <div className={clsx('absolute rounded-lg top-0 h-[100%] left-0 right-0 drop-shadow-md', bgGradient)} />
      {children && <div className="absolute top-0 left-0 h-full w-full">{children}</div>}
    </div>
  );
}
