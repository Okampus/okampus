import { Avatar } from '@okampus/ui/atoms';
import clsx from 'clsx';

export type UserLabelProps = {
  avatar?: string;
  name?: string;
  ellipsis?: boolean;
};

export function UserLabel({ avatar, name, ellipsis }: UserLabelProps) {
  return (
    <div className={clsx('flex gap-2 items-center font-heading')}>
      <Avatar src={avatar} name={name} size={12} />
      <div className={ellipsis ? 'line-clamp-1' : 'shrink-0'}>{name}</div>
    </div>
  );
}
