import AvatarImage from '../../atoms/Image/AvatarImage';
import clsx from 'clsx';
import type { ActorType } from '@prisma/client';

export type AvatarStack = {
  actors: { avatar?: string | null; name?: string; type?: ActorType }[];
  limit?: number;
  size?: number;
  itemsCount?: number;
  className?: string;
  itemClassName?: string;
};

export default function AvatarStack({
  actors,
  limit = 4,
  size = 32,
  itemsCount,
  className,
  itemClassName,
}: AvatarStack) {
  return (
    <div className={clsx('flex -space-x-1', className)}>
      {actors.slice(0, limit).map(({ avatar, name, type }, idx) => (
        <div className={itemClassName} key={idx} style={{ zIndex: limit - idx }}>
          <AvatarImage src={avatar} name={name} size={size} type={type} />
        </div>
      ))}
      {(itemsCount ?? actors.length) > limit && (
        <div className="text-0 flex items-center justify-center ml-3">
          +&thinsp;{(itemsCount ?? actors.length) - limit}
        </div>
      )}
    </div>
  );
}
