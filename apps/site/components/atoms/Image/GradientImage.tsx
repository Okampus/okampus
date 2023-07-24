import clsx from 'clsx';
import Image from 'next/image';

export type GradientImageProps = {
  src: string;
  className?: string;
  bgGradient?: string;
  rounded?: string;
  height?: string;
  children?: React.ReactNode;
  imageClassName?: string;
  onClick?: () => void;
};

export function GradientImage({
  onClick,
  src,
  children,
  bgGradient = 'bg-gradient-to-b from-[#000000bb] via-[#00000022] to-transparent',
  rounded = 'rounded-lg overflow-hidden',
  className = 'checkered',
  imageClassName,
}: GradientImageProps) {
  return (
    <div
      onClick={onClick}
      className={clsx('relative w-fit flex items-center justify-center min-w-[10rem]', className, rounded)}
    >
      <Image src={src} alt="" className={clsx(rounded, imageClassName, 'max-h-40')} fill={true} unoptimized />
      <div className={clsx('absolute inset-0 drop-shadow-md', bgGradient)} />
      {children && <div className="absolute inset-0">{children}</div>}
    </div>
  );
}
