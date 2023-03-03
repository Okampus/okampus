import { PopoverCard } from './PopoverCard';
import { CardSkeleton } from '../Skeleton/CardSkeleton';
import { useQuery } from '@apollo/client';
import { getFragmentData, getTeamWithMembersQuery, teamMembersFragment } from '@okampus/shared/graphql';
import { formatDateStandard } from '@okampus/shared/utils';
import { getAvatar, getBanner } from '@okampus/ui/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@okampus/ui/atoms';

export type TeamCardProps = { teamId: string; children: React.ReactNode };

export function TeamCard({ teamId, children }: TeamCardProps) {
  const { data } = useQuery(getTeamWithMembersQuery, { variables: { id: teamId } });

  const team = getFragmentData(teamMembersFragment, data?.teamById);
  const avatar = { src: getAvatar(team?.actor?.actorImages) };
  const banner = { src: getBanner(team?.actor?.actorImages) };

  return (
    <Popover forcePlacement={true} crossAxis={false} placementOffset={16}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent popoverClassName="!p-0 bg-1 ">
        {team && team.actor ? (
          <PopoverCard link={`/org/${team.actor.slug}`} name={team.actor.name} avatar={avatar} banner={banner}>
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
