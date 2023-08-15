import AvatarLabeled from './AvatarLabeled';
import TeamPopoverCard from '../PopoverCard/TeamPopoverCard';

import { getAvatar } from '../../../utils/actor-image/get-avatar';

import type { AvatarWrapperProps } from './AvatarLabeled';
import type { TeamMinimalInfo } from '../../../types/features/team.info';

export type TeamLabeledProps = {
  team: TeamMinimalInfo;
  avatarSize?: number;
  full?: boolean;
  label?: React.ReactNode;
  content?: React.ReactNode;
  small?: boolean;
  showCardOnClick?: boolean;
  skeletonClassName?: string;
  className?: string;
};

export default function TeamLabeled({
  team,
  avatarSize,
  full,
  label,
  content,
  small,
  showCardOnClick = true,
  skeletonClassName,
  className,
}: TeamLabeledProps) {
  const avatar = getAvatar(team.actor.actorImages)?.image.url;
  const name = team.actor.name;

  const wrapper = ({ children, className }: AvatarWrapperProps) => (
    <TeamPopoverCard triggerClassName={className} teamId={team.id}>
      {children}
    </TeamPopoverCard>
  );
  return (
    <AvatarLabeled
      avatar={avatar}
      avatarSize={avatarSize}
      type="team"
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
