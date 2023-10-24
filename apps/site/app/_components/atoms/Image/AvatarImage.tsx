import Skeleton from '../Skeleton/Skeleton';

import { getAvatarRounded } from '../../../../utils/avatar/avatar-rounded';

import { getColorHexFromData } from '@okampus/shared/utils';

import clsx from 'clsx';
import Image from 'next/image';

import type { ActorType } from '@prisma/client';
import type { CSSProperties } from 'react';

export type AvatarImageProps = {
  actor?: { avatar?: string | null; website?: string | null; name?: string; type?: ActorType };
  src?: string | null;
  website?: string | null;
  name?: string;
  size?: number;
  className?: string;
  hasBorder?: boolean;
  showName?: boolean;
};

export default function AvatarImage({
  actor,
  src,
  website,
  name,
  size = 35,
  className,
  hasBorder = true,
  showName = true,
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
  style.borderRadius = `${getAvatarRounded(actor?.type)}%`;

  const avatarClassName = clsx(
    'flex justify-center items-center overflow-hidden shrink-0 select-none font-medium text-white rounded-[50%]',
    hasBorder && 'border border-[var(--border-1)]',
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
      {showName && name?.slice(0, 2)}
    </div>
  );
}
