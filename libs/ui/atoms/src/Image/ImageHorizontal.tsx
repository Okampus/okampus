import { clsx } from 'clsx';

export type ImageHorizontalProps = {
  src: string;
  className?: string;
};

// TODO: object-cover instead of object-contain if the image ratio is near 16/9
export function ImageHorizontal({ src, className }: ImageHorizontalProps) {
  return (
    <div className={clsx(className, 'relative')}>
      <img src={src} className="object-cover blur-sm scale-100 w-full h-full" />
      <img src={src} className="absolute inset-0 object-contain max-w-full max-h-full m-auto" />
    </div>
  );
}