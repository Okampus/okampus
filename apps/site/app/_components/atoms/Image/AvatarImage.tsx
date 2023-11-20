'use client';

import Skeleton from '../Skeleton/Skeleton';

import { getAvatarRounded } from '../../../../utils/avatar/avatar-rounded';

// import { getColorHexFromData } from '@okampus/shared/utils';

import clsx from 'clsx';
import Image from 'next/image';

import { Buildings, GraduationCap } from '@phosphor-icons/react';
import { ActorType } from '@prisma/client';

import type { CSSProperties } from 'react';

export type AvatarImageProps = {
  actor?: { avatar?: string | null; website?: string | null; name?: string; type?: ActorType };
  type?: ActorType;
  src?: string | null;
  website?: string | null;
  name?: string;
  size?: number;
  className?: string;
  showFullName?: boolean;
};

const avatarClass =
  'flex ![text-decoration-color:transparent] justify-center items-center overflow-hidden shrink-0 select-none font-bold text-0 tracking-tight border border-[var(--border-1)] bg-[var(--bg-main)]';

export default function AvatarImage({
  actor,
  type,
  src,
  website,
  name,
  size = 40,
  className,
  showFullName = false,
}: AvatarImageProps) {
  if (actor) {
    src = src ?? actor.avatar;
    website = website ?? actor.website;
  }

  name = name ?? actor?.name ?? actor?.website ?? website ?? '?';

  const style: CSSProperties = { fontSize: `${size / 40}rem` };
  style.height = `${size / 16}rem`;
  style.width = style.height;

  type = type ?? actor?.type;
  if (type) style.borderRadius = `${getAvatarRounded(type || actor?.type)}%`;
  const avatarClassName = clsx(avatarClass, className);

  if (!name && !src && !website) return <Skeleton className={avatarClassName} style={style} />;
  if (src || website) {
    const apparentSize = size * 4;
    const config = apparentSize ? { fill: false, width: apparentSize, height: apparentSize } : { fill: true };
    src = src ?? `https://logo.clearbit.com/${website}`;
    return <Image src={src} alt={name} className={avatarClassName} style={style} {...config} unoptimized />;
  }

  if (type === ActorType.LegalUnit)
    return (
      <div className={avatarClassName} style={style}>
        <Buildings className="w-5 h-5" />
      </div>
    );
  if (type === ActorType.Tenant)
    return (
      <div className={avatarClassName} style={style}>
        <GraduationCap className="w-5 h-5" />
      </div>
    );

  return (
    <div className={avatarClassName} style={style}>
      {showFullName ? name : name?.slice?.(0, 2)}
    </div>
  );
}
