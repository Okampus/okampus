'use client';

import { avatarClass } from './AvatarImage';
import clsx from 'clsx';

import { ActorType } from '@prisma/client';
import { Bank, Buildings, Question, Storefront, User, UsersThree } from '@phosphor-icons/react';
import type { CSSProperties } from 'react';

export type FallbackAvatarProps = {
  actorType?: ActorType | null;
  className?: string;
  size?: number;
};
export function FallbackAvatar({ actorType, className, size = 44 }: FallbackAvatarProps) {
  const style: CSSProperties = { height: `${size / 16}rem` };
  style.width = style.height;

  return (
    <div className={clsx(avatarClass, 'rounded-[50%]', className)} style={style}>
      {actorType === ActorType.Team && <UsersThree className="w-6 h-6" />}
      {actorType === ActorType.User && <User className="w-6 h-6" />}
      {actorType === ActorType.LegalUnit && <Storefront className="w-6 h-6" />}
      {actorType === ActorType.Bank && <Bank className="w-6 h-6" />}
      {actorType === ActorType.Tenant && <Buildings className="w-6 h-6" />}
      {!actorType && <Question className="w-6 h-6" />}
    </div>
  );
}
