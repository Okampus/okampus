import Stack from './Stack';

import AvatarImage from '../../atoms/Image/AvatarImage';
import TeamPopoverCard from '../../../_views/PopoverCard/TeamPopoverCard';
import TeamLabeled from '../Labeled/TeamLabeled';

import type { TeamMinimal } from '../../../../types/prisma/Team/team-minimal';

export type TeamStackProps = { teams: TeamMinimal[]; itemsCount?: number; limit?: number; size?: number };
export default function TeamStack({ teams, itemsCount, limit = 3, size = 14 }: TeamStackProps) {
  return (
    <Stack
      className="-space-x-1"
      items={teams}
      itemsCount={itemsCount}
      limit={limit}
      render={(team) => (
        <TeamPopoverCard team={team}>
          <AvatarImage actor={team.actor} size={size} />
        </TeamPopoverCard>
      )}
      renderListElement={(team) => <TeamLabeled team={team} />}
    />
  );
}
