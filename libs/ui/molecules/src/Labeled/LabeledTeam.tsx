import { TeamPopoverCard } from '../PopoverCard/TeamPopoverCard';
import { AvatarImage } from '@okampus/ui/atoms';
import { clsx } from 'clsx';
import { AVATAR_TEAM_ROUNDED } from '@okampus/shared/consts';

export type TeamLabelProps = {
  avatar?: string;
  id: string;
  name?: string;
  teamType?: string;
  ellipsis?: boolean;
};

export function LabeledTeam({ name, teamType, id, avatar, ellipsis }: TeamLabelProps) {
  return (
    <div className="flex gap-3 items-center text-hover contrast-hover text-0-hover">
      <TeamPopoverCard teamId={id}>
        <AvatarImage src={avatar} name={name} size={teamType ? 18 : 11} rounded={AVATAR_TEAM_ROUNDED} />
      </TeamPopoverCard>

      <TeamPopoverCard teamId={id}>
        <div
          className={clsx(
            'text-1 flex flex-col justify-start items-start leading-tight font-semibold',
            !ellipsis && 'shrink-0'
          )}
        >
          <span className={clsx(ellipsis ? 'line-clamp-1' : '')}>{name}</span>
          {teamType && <div className={clsx(ellipsis && 'line-clamp-1', 'font-normal')}>{teamType}</div>}
        </div>
      </TeamPopoverCard>
    </div>
  );
}
