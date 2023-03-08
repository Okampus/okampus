import { UserCard } from '../Card/UserCard';
import { Avatar } from '@okampus/ui/atoms';
import { clsx } from 'clsx';
import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';

import type { AvatarProps } from '@okampus/ui/atoms';

export type LabeledSideUserProps = {
  name: string;
  id: string;
  avatar?: { src?: AvatarProps['src']; size?: AvatarProps['size'] };
  ellipsis?: boolean;
};

export function LabeledSideUser({ name, id, avatar, ellipsis }: LabeledSideUserProps) {
  return (
    <UserCard userId={id} triggerClassName="w-full">
      <div className="flex gap-2 items-center font-heading py-1.5 px-3 opacity-[0.85] hover:opacity-100 bg-hover-1 rounded-2xl">
        <Avatar src={avatar?.src} name={name} size={avatar?.size ?? 18} rounded={AVATAR_USER_ROUNDED} />
        <div className={clsx(ellipsis ? 'line-clamp-1' : 'shrink-0', 'lg-max:hidden')}>{name}</div>
      </div>
    </UserCard>
  );
}
