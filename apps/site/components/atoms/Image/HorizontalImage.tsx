import clsx from 'clsx';
import Image from 'next/image';

export type HorizontalImageProps = { src: string; className?: string };

// TODO: object-cover instead of object-contain if the image ratio is near 16/9
export default function HorizontalImage({ src, className }: HorizontalImageProps) {
  return (
    <div className={clsx(className, 'relative')}>
      <Image src={src} className="object-cover blur-sm scale-100 w-full h-full" alt="" fill={true} unoptimized />
      <Image
        src={src}
        className="absolute inset-0 object-contain max-w-full max-h-full m-auto"
        alt=""
        fill={true}
        unoptimized
      />
    </div>
  );
}
