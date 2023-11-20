import AvatarLabeled from './AvatarLabeled';
import UserPopoverCard from '../../../_views/PopoverCard/UserPopoverCard';

import type { UserMinimal } from '../../../../types/prisma/User/user-minimal';

export type UserLabeledProps = {
  user: UserMinimal;
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
  content,
  small,
  showCardOnClick = true,
  className,
  labelClassName,
  contentClassName,
}: UserLabeledProps) {
  const inner = (
    <AvatarLabeled
      name={user.actor.name}
      avatar={user.actor.avatar}
      type={user.actor.type}
      label={label}
      content={content}
      small={small}
      className={className}
      labelClassName={labelClassName}
      contentClassName={contentClassName}
    />
  );

  if (showCardOnClick)
    return (
      <UserPopoverCard triggerClassName={className} userId={user.id.toString()}>
        {inner}
      </UserPopoverCard>
    );

  return inner;
}
