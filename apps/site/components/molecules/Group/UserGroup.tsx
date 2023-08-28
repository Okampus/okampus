import Group from './Group';
import AvatarImage from '../../atoms/Image/AvatarImage';
import UserLabeled from '../Labeled/UserLabeled';
import UserPopoverCard from '../PopoverCard/UserPopoverCard';

import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';

import type { UserMinimalInfo } from '../../../types/features/user.info';

export type UserGroupProps = {
  users: UserMinimalInfo[];
  itemsCount?: number;
  limit?: number;
  size?: number;
  title?: string;
};
export default function UserGroup({ users, itemsCount, limit = 3, size = 14, title }: UserGroupProps) {
  return (
    <Group
      className="-space-x-1"
      items={users}
      itemsCount={itemsCount}
      limit={limit}
      size={size}
      title={title}
      rounded={AVATAR_USER_ROUNDED}
      render={(user) => (
        <UserPopoverCard userId={user.id}>
          <AvatarImage actor={user.actor} size={size} type="user" />
        </UserPopoverCard>
      )}
      renderListElement={(user) => <UserLabeled user={user} />}
    />
  );
}
