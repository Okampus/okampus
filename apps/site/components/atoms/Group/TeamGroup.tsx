import Group from './Group';
import AvatarImage from '../Image/AvatarImage';
import TeamPopoverCard from '../../molecules/PopoverCard/TeamPopoverCard';

import TeamLabeled from '../../molecules/Labeled/TeamLabeled';
import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import type { TeamBaseInfo } from '@okampus/shared/graphql';

export type TeamGroupProps = { teams: TeamBaseInfo[]; itemsCount?: number; limit?: number; size?: number };
export default function TeamGroup({ teams, itemsCount, limit = 3, size = 14 }: TeamGroupProps) {
  return (
    <Group
      className="-space-x-1"
      items={teams}
      itemsCount={itemsCount}
      limit={limit}
      size={size}
      rounded={AVATAR_USER_ROUNDED}
      render={(team) => (
        <TeamPopoverCard teamId={team.id}>
          <AvatarImage actor={team.actor} size={size} type="team" />
        </TeamPopoverCard>
      )}
      renderListElement={(team) => <TeamLabeled team={team} />}
    />
  );
}
