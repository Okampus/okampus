import Stack from './Stack';
import AvatarImage from '../../atoms/Image/AvatarImage';
import UserLabeled from '../Labeled/UserLabeled';
import UserPopoverCard from '../../../_views/PopoverCard/UserPopoverCard';

import clsx from 'clsx';

import type { UserMinimal } from '../../../../types/prisma/User/user-minimal';

export type UserGroupProps = {
  users: UserMinimal[];
  className?: string;
  itemsCount?: number;
  limit?: number;
  size?: number;
  title?: string;
};
export default function UserStack({ users, className, itemsCount, limit = 3, size = 28, title }: UserGroupProps) {
  return (
    <Stack
      className={clsx('-space-x-1', className)}
      items={users}
      itemsCount={itemsCount}
      limit={limit}
      title={title}
      render={(user) => (
        <UserPopoverCard userId={user.id.toString()}>
          <AvatarImage actor={user.actor} size={size} />
        </UserPopoverCard>
      )}
      renderListElement={(user) => <UserLabeled user={user} />}
    />
  );
}
