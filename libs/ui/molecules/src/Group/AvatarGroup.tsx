import { ItemGroup } from './ItemGroup';
import { LabeledUser } from '../Labeled/LabeledUser';
import { UserCard } from '../Card/UserCard';
import { Avatar } from '@okampus/ui/atoms';

import type { AvatarProps } from '@okampus/ui/atoms';

export type UserItem = AvatarProps & { id: string };

export type AvatarGroupProps = {
  users: UserItem[];
  limit?: number;
  size?: number;
};

export function AvatarGroup({ users, limit = 3, size = 14 }: AvatarGroupProps) {
  return (
    <ItemGroup
      className="space-x-[-0.5rem]"
      items={users}
      limit={limit}
      size={size}
      render={(avatarProps) => (
        <UserCard userId={avatarProps.id}>
          <Avatar {...avatarProps} size={size} />
        </UserCard>
      )}
      renderListElement={(item) => <LabeledUser name={item.name ?? '?'} avatar={item.src} id={item.id} />}
    />
  );
}
