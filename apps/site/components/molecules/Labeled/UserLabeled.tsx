import AvatarLabeled from './AvatarLabeled';
import UserPopoverCard from '../PopoverCard/UserPopoverCard';

import { getAvatar } from '../../../utils/actor-image/get-avatar';
import type { IndividualBaseInfo } from '@okampus/shared/graphql';

export type UserLabeledProps = {
  id: string;
  individual?: IndividualBaseInfo;
  label?: React.ReactNode;
  full?: boolean;
  content?: React.ReactNode;
  small?: boolean;
  showCardOnClick?: boolean;
  skeletonClassName?: string;
  className?: string;
};

export default function UserLabeled({
  id,
  individual,
  label,
  full,
  content,
  small,
  showCardOnClick = true,
  skeletonClassName,
  className,
}: UserLabeledProps) {
  const avatar = getAvatar(individual?.actor?.actorImages)?.image.url;
  const name = individual?.actor?.name;

  const wrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <UserPopoverCard triggerClassName={className} userId={id}>
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
    />
  );
}
