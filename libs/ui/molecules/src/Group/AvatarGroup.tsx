import { Avatar, AvatarProps } from '@okampus/ui/atoms';
import { ItemGroup } from './ItemGroup';

export type UserItem = AvatarProps & { id: string };

export type AvatarGroupProps = {
  avatars: UserItem[];
  limit?: number;
  size?: number;
};

export function AvatarGroup({ avatars, limit = 3, size = 14 }: AvatarGroupProps) {
  return (
    <ItemGroup
      className="space-x-[-0.5rem]"
      items={avatars}
      limit={limit}
      size={size}
      render={(avatarProps) => {
        return <Avatar {...avatarProps} size={size} />;
      }}
    />
  );
}
