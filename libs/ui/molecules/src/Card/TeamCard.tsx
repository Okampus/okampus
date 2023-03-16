import { PopoverCard } from './PopoverCard';
import { CardSkeleton } from '../Skeleton/CardSkeleton';

import { Popover, PopoverTrigger, PopoverContent } from '@okampus/ui/atoms';
import { getAvatar, getBanner, loadTeamMembersFragment } from '@okampus/ui/utils';
import { AVATAR_TEAM_ROUNDED, TEAM_ROUTE } from '@okampus/shared/consts';
import { getFragmentData, getTeamWithMembersQuery, teamMembersFragment } from '@okampus/shared/graphql';
import { formatDateStandard } from '@okampus/shared/utils';

import { useLazyQuery } from '@apollo/client';

export type TeamCardProps = { teamId: string; children: React.ReactNode };

export function TeamCard({ teamId, children }: TeamCardProps) {
  const [getTeam, { data }] = useLazyQuery(getTeamWithMembersQuery, { variables: { id: teamId } });

  const team = loadTeamMembersFragment(getFragmentData(teamMembersFragment, data?.teamById));
  const avatar = { src: getAvatar(team?.actor?.actorImages), rounded: AVATAR_TEAM_ROUNDED };
  const banner = { src: getBanner(team?.actor?.actorImages) };

  return (
    <Popover forcePlacement={true} crossAxis={false} placementOffset={16} placement="right-start">
      <PopoverTrigger onClick={() => getTeam()}>{children}</PopoverTrigger>
      <PopoverContent popoverClassName="!p-0 bg-1 ">
        {team && team.actor ? (
          <PopoverCard link={TEAM_ROUTE(team.actor.slug)} name={team.actor.name} avatar={avatar} banner={banner}>
            <div className="text-2">{team.actor.bio}</div>
            <hr className={'my-2 border-color-3'} />
            <div className="text-1 italic text-sm">Actif depuis le {formatDateStandard(team?.createdAt)}</div>
          </PopoverCard>
        ) : (
          <CardSkeleton />
        )}
      </PopoverContent>
    </Popover>
  );
}
