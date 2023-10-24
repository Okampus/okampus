import Group from './Group';
import AvatarImage from '../../atoms/Image/AvatarImage';
import TeamPopoverCard from '../PopoverCard/TeamPopoverCard';

import TeamLabeled from '../Labeled/TeamLabeled';

import { AVATAR_TEAM_ROUNDED } from '../../../../utils/avatar/avatar-rounded';

import type { TeamMinimalInfo } from '../../../../types/features/team.info';

export type TeamGroupProps = { teams: TeamMinimalInfo[]; itemsCount?: number; limit?: number; size?: number };
export default function TeamGroup({ teams, itemsCount, limit = 3, size = 14 }: TeamGroupProps) {
  return (
    <Group
      className="-space-x-1"
      items={teams}
      itemsCount={itemsCount}
      limit={limit}
      size={size}
      rounded={AVATAR_TEAM_ROUNDED}
      render={(team) => (
        <TeamPopoverCard teamId={team.id}>
          <AvatarImage actor={team.actor} size={size} />
        </TeamPopoverCard>
      )}
      renderListElement={(team) => <TeamLabeled team={team} />}
    />
  );
}
