import { ItemGroup } from './ItemGroup';
import { LabeledUser } from '../Labeled/LabeledUser';
import { UserPopoverCard } from '../PopoverCard/UserPopoverCard';

import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import { AvatarImage } from '@okampus/ui/atoms';

import type { AvatarImageProps } from '@okampus/ui/atoms';

export type AvatarGroupUserItem = Omit<AvatarImageProps, 'rounded'> & { id: string };

export type AvatarGroupProps = {
  users: AvatarGroupUserItem[];
  itemsCount?: number;
  limit?: number;
  size?: number;
};

export function AvatarGroupUser({ users, itemsCount, limit = 3, size = 14 }: AvatarGroupProps) {
  return (
    <ItemGroup
      className="space-x-[-0.5rem]"
      items={users}
      itemsCount={itemsCount}
      limit={limit}
      size={size}
      rounded={AVATAR_USER_ROUNDED}
      render={(avatarProps) => (
        <UserPopoverCard userId={avatarProps.id}>
          <AvatarImage {...avatarProps} size={size} type="user" />
        </UserPopoverCard>
      )}
      renderListElement={(item) => <LabeledUser name={item.name ?? '?'} avatar={{ src: item.src }} id={item.id} />}
    />
  );
}
