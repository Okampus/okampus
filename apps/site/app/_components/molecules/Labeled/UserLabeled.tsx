import AvatarLabeled from './AvatarLabeled';
import UserPopoverCard from '../PopoverCard/UserPopoverCard';

import type { UserMinimalInfo } from '../../../../types/features/user.info';

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
  const wrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <UserPopoverCard triggerClassName={className} userId={user.id.toString()}>
      {children}
    </UserPopoverCard>
  );
  return (
    <AvatarLabeled
      name={user.actor.name}
      avatar={user.actor.avatar}
      full={full}
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
