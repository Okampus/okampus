import { UserCard } from '../Card/UserCard';
import { Avatar } from '@okampus/ui/atoms';
import { clsx } from 'clsx';
import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';

import type { AvatarProps } from '@okampus/ui/atoms';

export type UserLabelProps = {
  name: string;
  id: string;
  avatar?: { src?: AvatarProps['src']; size?: AvatarProps['size'] };
  ellipsis?: boolean;
};

export function LabeledUser({ name, id, avatar, ellipsis }: UserLabelProps) {
  return (
    <div className="flex gap-item items-center font-heading">
      <UserCard userId={id}>
        <Avatar src={avatar?.src} name={name} size={avatar?.size ?? 18} rounded={AVATAR_USER_ROUNDED} />
      </UserCard>

      <UserCard userId={id}>
        <div className={clsx(ellipsis ? 'line-clamp-1' : 'shrink-0', 'hover:underline')}>{name}</div>
      </UserCard>
    </div>
  );
}
