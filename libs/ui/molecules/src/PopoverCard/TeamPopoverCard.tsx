import { PopoverCard } from './PopoverCard';
import { CardSkeleton } from '../Skeleton/CardSkeleton';

import { AVATAR_TEAM_ROUNDED, TEAM_ROUTE } from '@okampus/shared/consts';
import { teamWithMembersInfo, useTypedLazyQuery } from '@okampus/shared/graphql';
import { formatDateStandard } from '@okampus/shared/utils';

import { Popover, PopoverTrigger, PopoverContent } from '@okampus/ui/atoms';
import { getAvatar, getBanner } from '@okampus/ui/utils';

import type { TeamWithMembersInfo } from '@okampus/shared/graphql';

export type TeamPopoverCardProps = { teamId: string; children: React.ReactNode };

const renderContent = (team?: TeamWithMembersInfo) => {
  if (!team) return <CardSkeleton />;

  const avatar = { src: getAvatar(team.actor?.actorImages), rounded: AVATAR_TEAM_ROUNDED };
  const banner = { src: getBanner(team.actor?.actorImages) };

  return (
    <PopoverCard link={TEAM_ROUTE(team.actor?.slug)} name={team.actor?.name} avatar={avatar} banner={banner}>
      {team.actor?.bio && (
        <>
          <div className="text-2 line-clamp-6">{team.actor.bio}</div>
          <hr className="my-2 border-color-3" />
        </>
      )}
      <div className="text-1 italic text-sm">Actif depuis le {formatDateStandard(team.createdAt as string)}</div>
    </PopoverCard>
  );
};

export function TeamPopoverCard({ teamId, children }: TeamPopoverCardProps) {
  const [getTeam, { data }] = useTypedLazyQuery({
    team: [{ where: { id: { _eq: teamId } }, limit: 1 }, teamWithMembersInfo],
  });

  return (
    <Popover forcePlacement={true} crossAxis={false} placementOffset={16} placement="right-start">
      <PopoverTrigger onClick={() => getTeam()}>{children}</PopoverTrigger>
      <PopoverContent popoverClassName="rounded-2xl bg-1">{renderContent(data?.team?.[0])}</PopoverContent>
    </Popover>
  );
}
