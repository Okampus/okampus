import { TeamCard } from '../Card/TeamCard';
import { Avatar } from '@okampus/ui/atoms';
import { clsx } from 'clsx';

export type TeamLabelProps = {
  name: string;
  teamType: string;
  id: string;
  avatar?: string;
  ellipsis?: boolean;
};

export function LabeledTeam({ name, teamType, id, avatar, ellipsis }: TeamLabelProps) {
  return (
    <div className="flex gap-2 items-center font-heading">
      <TeamCard teamId={id}>
        <Avatar src={avatar} name={name} size={18} />
      </TeamCard>

      <TeamCard teamId={id}>
        <div
          className={clsx(
            'hover:underline flex flex-col justify-start items-start leading-tight',
            !ellipsis && 'shrink-0'
          )}
        >
          <span className={ellipsis ? 'line-clamp-1' : ''}>{name}</span>
          <div className={clsx(ellipsis && 'line-clamp-1', 'text-2 text-sm')}>{teamType}</div>
        </div>
      </TeamCard>
    </div>
  );
}