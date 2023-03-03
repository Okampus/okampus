import { UserCard } from '../Card/UserCard';
import { Avatar } from '@okampus/ui/atoms';
import { clsx } from 'clsx';

export type UserLabelProps = {
  name: string;
  id: string;
  avatar?: string;
  ellipsis?: boolean;
};

export function LabeledUser({ name, id, avatar, ellipsis }: UserLabelProps) {
  return (
    <div className="flex gap-2 items-center font-heading">
      <UserCard userId={id}>
        <Avatar src={avatar} name={name} size={18} />
      </UserCard>

      <UserCard userId={id}>
        <div className={clsx(ellipsis ? 'line-clamp-1' : 'shrink-0', 'hover:underline')}>{name}</div>
      </UserCard>
    </div>
  );
}
