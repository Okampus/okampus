import Group from './Group';
import AvatarImage from '../../atoms/Image/AvatarImage';
import UserLabeled from '../Labeled/UserLabeled';
import UserPopoverCard from '../PopoverCard/UserPopoverCard';

import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import clsx from 'clsx';

import type { UserMinimalInfo } from '../../../types/features/user.info';

export type UserGroupProps = {
  users: UserMinimalInfo[];
  className?: string;
  itemsCount?: number;
  limit?: number;
  size?: number;
  title?: string;
};
export default function UserGroup({ users, className, itemsCount, limit = 3, size = 28, title }: UserGroupProps) {
  return (
    <Group
      className={clsx('-space-x-1', className)}
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
