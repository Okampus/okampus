import Skeleton from '../Skeleton/Skeleton';

import { AVATAR_USER_ROUNDED, AVATAR_TEAM_ROUNDED } from '@okampus/shared/consts';
import { getColorHexFromData } from '@okampus/shared/utils';

import clsx from 'clsx';
import Image from 'next/image';

import type { CSSProperties } from 'react';

export function getAvatarRounded(type?: 'user' | 'team') {
  if (type === 'user') return AVATAR_USER_ROUNDED;
  if (type === 'team') return AVATAR_TEAM_ROUNDED;
  return 0;
}

export type AvatarImageProps = {
  type?: 'user' | 'team' | 'none';
  actor?: { avatar?: string | null; website?: string | null; name?: string };
  src?: string | null;
  website?: string | null;
  name?: string;
  size?: number;
  className?: string;
  hasBorder?: boolean;
};

export default function AvatarImage({
  actor,
  src,
  website,
  name,
  size = 35,
  type = 'user',
  className,
  hasBorder = true,
}: AvatarImageProps) {
  if (actor) {
    website = website ?? actor.website;
    src = src ?? actor.avatar;
    name = name ?? actor.name;
  }

  size = size ?? 14;
  const style: CSSProperties = { fontSize: `${size / 32}rem` };
  style.height = `${size / 14}rem`;
  style.width = style.height;

  if (type !== 'none') style.borderRadius = `${getAvatarRounded(type)}%`;

  const avatarClassName = clsx(
    'flex justify-center items-center overflow-hidden shrink-0 select-none font-medium text-white',
    hasBorder && 'border border-color-1',
    className,
  );

  if (!name && !src && !website) return <Skeleton className={avatarClassName} style={style} />;
  if (src || website) {
    const apparentSize = size * 4;
    const config = apparentSize ? { fill: false, width: apparentSize, height: apparentSize } : { fill: true };
    return (
      <Image
        src={src ?? `https://logo.clearbit.com/${website}`}
        alt={name ?? 'Avatar'}
        className={avatarClassName}
        style={style}
        {...config}
        unoptimized
      />
    );
  }
  return (
    <div className={avatarClassName} style={{ backgroundColor: getColorHexFromData(name), ...style }}>
      {name?.slice(0, 2)}
    </div>
  );
}
