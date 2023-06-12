import { HorizontalImage } from '@okampus/ui/atoms';
import clsx from 'clsx';

export type ImageGroupProps = {
  images: string[];
  height?: number;
  className?: string;
};

export function ImageGroup({ images, className }: ImageGroupProps) {
  const left = images[0];
  const right = images.slice(1, 3);

  return (
    <div className={clsx('aspect-[16/9] flex card-md !p-0', className)}>
      <HorizontalImage
        src={left}
        className={clsx(right.length > 0 ? 'w-[60%] border-r border-gray-700' : 'w-full', 'object-contain')}
      />
      {right.length > 0 && (
        <div className="flex flex-col w-[40%]">
          {right.map((item, index) => (
            <HorizontalImage
              key={index}
              src={item}
              className={clsx(
                right.length > 1 ? 'h-[50%]' : 'h-full',
                index === 1 && 'border-t border-gray-700',
                'object-contain'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
