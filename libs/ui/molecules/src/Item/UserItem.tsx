import { AvatarImage } from '@okampus/ui/atoms';
import type { AvatarImageProps } from '@okampus/ui/atoms';

export type UserItemProps = {
  name: string;
  avatar?: { src?: AvatarImageProps['src']; size?: AvatarImageProps['size'] };
};

export function UserItem({ name, avatar }: UserItemProps) {
  return (
    <div className="flex items-center font-medium text-1 gap-2">
      <AvatarImage src={avatar?.src} name={name} size={avatar?.size ?? 18} className="rounded-[50%]" />
      <div>{name}</div>
    </div>
  );
}
