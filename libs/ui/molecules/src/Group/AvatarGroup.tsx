import { ItemGroup } from './ItemGroup';
import { UserLabel } from '../Labeled/LabeledUser';
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
      render={(avatarProps) => {
        return <Avatar {...avatarProps} size={size} />;
      }}
      renderListElement={(item) => <UserLabel name={item.name} />}
    />
  );
}
