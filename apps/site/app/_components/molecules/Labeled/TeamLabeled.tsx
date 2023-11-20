import AvatarLabeled from './AvatarLabeled';
import TeamPopoverCard from '../../../_views/PopoverCard/TeamPopoverCard';

import clsx from 'clsx';

import type { TeamMinimal } from '../../../../types/prisma/Team/team-minimal';

export type TeamLabeledProps = {
  team: TeamMinimal;
  avatarSize?: number;
  full?: boolean;
  label?: React.ReactNode;
  content?: React.ReactNode;
  small?: boolean;
  showCardOnClick?: boolean;
  className?: string;
  labelClassName?: string;
  contentClassName?: string;
};

export default function TeamLabeled({
  team,
  avatarSize,
  full,
  label,
  content,
  small,
  showCardOnClick = true,
  className,
  labelClassName,
  contentClassName,
}: TeamLabeledProps) {
  const name = team.actor.name;

  const inner = (
    <AvatarLabeled
      avatar={team.actor.avatar}
      avatarSize={avatarSize}
      name={name}
      label={label}
      content={content}
      small={small}
      className={className}
      labelClassName={labelClassName}
      contentClassName={contentClassName}
    />
  );

  if (showCardOnClick) {
    return (
      <TeamPopoverCard triggerClassName={clsx(className, 'shrink-0')} team={team}>
        {inner}
      </TeamPopoverCard>
    );
  }

  return inner;
}
