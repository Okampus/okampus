import { UserCard } from '../Card/UserCard';

import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import { Avatar } from '@okampus/ui/atoms';

import { clsx } from 'clsx';

import type { AvatarProps } from '@okampus/ui/atoms';

export type LabeledSideUserProps = {
  name: string;
  id: string;
  avatar?: { src?: AvatarProps['src']; size?: AvatarProps['size'] };
  ellipsis?: boolean;
};

export function LabeledSideUser({ name, id, avatar, ellipsis }: LabeledSideUserProps) {
  return (
    <UserCard userId={id} triggerClassName="w-full rounded-xl">
      <div className="flex gap-item items-center p-2 bg-1-hover rounded-xl text-1 text-0-hover font-semibold">
        <Avatar src={avatar?.src} name={name} size={14} rounded={AVATAR_USER_ROUNDED} />
        <div className={clsx(ellipsis ? 'line-clamp-1' : 'shrink-0', 'xl-max:hidden font-heading')}>{name}</div>
      </div>
    </UserCard>
  );
}
