import AvatarLabeled from './AvatarLabeled';
import UserPopoverCard from '../PopoverCard/UserPopoverCard';

import { getAvatar } from '../../../utils/actor-image/get-avatar';
import type { UserMinimalInfo } from '../../../types/features/user.info';

export type UserLabeledProps = {
  user: UserMinimalInfo;
  label?: React.ReactNode;
  full?: boolean;
  content?: React.ReactNode;
  small?: boolean;
  showCardOnClick?: boolean;
  skeletonClassName?: string;
  className?: string;
  labelClassName?: string;
  contentClassName?: string;
};

export default function UserLabeled({
  user,
  label,
  full,
  content,
  small,
  showCardOnClick = true,
  skeletonClassName,
  className,
  labelClassName,
  contentClassName,
}: UserLabeledProps) {
  const avatar = getAvatar(user.actor?.actorImages)?.image.url;
  const name = user.actor?.name;

  const wrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <UserPopoverCard triggerClassName={className} userId={user.id}>
      {children}
    </UserPopoverCard>
  );
  return (
    <AvatarLabeled
      avatar={avatar}
      type="user"
      full={full}
      name={name}
      label={label}
      content={content}
      small={small}
      wrapper={showCardOnClick ? wrapper : undefined}
      skeletonLabelClassName={skeletonClassName}
      className={className}
      labelClassName={labelClassName}
      contentClassName={contentClassName}
    />
  );
}
