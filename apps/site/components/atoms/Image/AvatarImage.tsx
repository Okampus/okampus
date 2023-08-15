import Skeleton from '../Skeleton/Skeleton';
import { getAvatar, getAvatarRounded } from '../../../utils/actor-image/get-avatar';

import { getColorHexFromData } from '@okampus/shared/utils';

import clsx from 'clsx';
import Image from 'next/image';

import type { ActorImageMinimalInfo } from '../../../types/features/actor-image.info';
import type { CSSProperties } from 'react';

export type AvatarImageProps = {
  actor?: {
    actorImages?: ActorImageMinimalInfo[];
    website?: string;
    name?: string;
  };
  src?: string;
  website?: string;
  name?: string;
  size?: number | null;
  indicativeSize?: number;
  type?: 'user' | 'team' | 'tenant';
  className?: string;
};

export default function AvatarImage({
  actor,
  src,
  website,
  name,
  size = 18,
  indicativeSize,
  type,
  className,
}: AvatarImageProps) {
  if (actor) {
    const avatar = getAvatar(actor.actorImages);
    website = website ?? actor.website;
    src = src ?? avatar?.image.url;
    name = name ?? actor.name;
  }

  const style: CSSProperties = { fontSize: `${(size ?? 12) / 12}rem` };
  style.height = size ? `${size / 6}rem` : '100%';
  style.width = style.height;
  if (type) style.borderRadius = `${getAvatarRounded(type)}%`;

  const avatarClassName = clsx(
    'flex justify-center items-center overflow-hidden shrink-0 select-none font-medium text-white',
    className,
  );

  if (!name && !src && !website) return <Skeleton className={avatarClassName} style={style} />;
  if (src || website) {
    const apparentSize = size ? size * 4 : indicativeSize;
    const config = apparentSize ? { fill: false, width: apparentSize, height: apparentSize } : { fill: true };
    return (
      <Image
        src={src ?? `https://logo.clearbit.com/${website}`}
        alt={name || 'Avatar'}
        className={avatarClassName}
        style={style}
        {...config}
        unoptimized
      />
    );
  }
  return (
    <div className={avatarClassName} style={{ backgroundColor: getColorHexFromData(name), ...style }}>
      {name?.[0]}
    </div>
  );
}
