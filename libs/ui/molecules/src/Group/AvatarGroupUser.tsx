import { ItemGroup } from './ItemGroup';
import { LabeledUser } from '../Labeled/LabeledUser';
import { UserCard } from '../Card/UserCard';

import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import { Avatar } from '@okampus/ui/atoms';

import type { AvatarProps } from '@okampus/ui/atoms';

export type UserItem = Omit<AvatarProps, 'rounded'> & { id: string };

export type AvatarGroupProps = {
  users: UserItem[];
  limit?: number;
  size?: number;
};

export function AvatarGroupUser({ users, limit = 3, size = 14 }: AvatarGroupProps) {
  return (
    <ItemGroup
      className="space-x-[-0.5rem]"
      items={users}
      limit={limit}
      size={size}
      rounded={AVATAR_USER_ROUNDED}
      render={(avatarProps) => (
        <UserCard userId={avatarProps.id}>
          <Avatar {...avatarProps} size={size} rounded={AVATAR_USER_ROUNDED} />
        </UserCard>
      )}
      renderListElement={(item) => <LabeledUser name={item.name ?? '?'} avatar={{ src: item.src }} id={item.id} />}
    />
  );
}
