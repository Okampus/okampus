import AvatarImage from '../../atoms/Image/AvatarImage';
import Skeleton from '../../atoms/Skeleton/Skeleton';

import clsx from 'clsx';
import Link from 'next/link';

import type { ActorWithAvatar } from '../../../../types/prisma/Actor/actor-with-avatar';
import type { ActorType } from '@prisma/client';

export type AvatarWrapperProps = { children: React.ReactNode; className?: string };

export type AvatarLabeledProps = {
  actor?: ActorWithAvatar;
  href?: string;
  avatar?: string | null;
  type?: ActorType;
  avatarSize?: number;
  name?: string;
  website?: string | null;
  small?: boolean;
  label?: React.ReactNode;
  content?: React.ReactNode;
  skeletonContentClassName?: string;
  className?: string;
  labelClassName?: string;
  contentClassName?: string;
};

export default function AvatarLabeled({
  actor,
  href,
  avatar,
  type,
  avatarSize,
  name,
  website,
  small,
  label,
  content,
  skeletonContentClassName,
  className,
  labelClassName,
  contentClassName = 'text-sm text-2',
}: AvatarLabeledProps) {
  const align = content ? 'items-start' : 'items-center';
  const avatarClass = clsx('flex', className, small ? 'gap-2' : 'gap-2.5', align);
  const labelClass = clsx('font-medium leading-5 text-base', labelClassName);

  const avatarLabel = label ?? name ?? actor?.name;
  const wrapperClass = 'text-0 flex flex-col items-start';

  const avatarElement = (
    <AvatarImage
      actor={actor}
      src={avatar ?? undefined}
      name={name}
      type={type}
      size={avatarSize ?? (small ? 36 : 46)}
      website={website}
    />
  );

  const loading = !actor && !name && !avatar;
  const inner = loading ? (
    <div className={clsx(wrapperClass, 'gap-1')}>
      <Skeleton className={small ? 'w-44 h-3' : 'w-44 h-4'} />
      {content && <Skeleton className={skeletonContentClassName ?? 'w-44 h-3'} />}
    </div>
  ) : (
    <div className={wrapperClass}>
      {href ? (
        <Link href={href} className={labelClass}>
          {avatarLabel}
        </Link>
      ) : (
        <div className={labelClass}>{avatarLabel}</div>
      )}
      {content && <div className={contentClassName}>{content}</div>}
    </div>
  );

  return (
    <span className={avatarClass}>
      {avatarElement}
      {inner}
    </span>
  );
}
