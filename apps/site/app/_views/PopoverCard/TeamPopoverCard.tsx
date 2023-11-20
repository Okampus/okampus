import PopoverCard from './PopoverCard';

import Popover from '../../_components/atoms/Popover/Popover';
import PopoverTrigger from '../../_components/atoms/Popover/PopoverTrigger';
import PopoverContent from '../../_components/atoms/Popover/PopoverContent';
import Skeleton from '../../_components/atoms/Skeleton/Skeleton';

import { useTranslation } from '../../_hooks/context/useTranslation';

import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus-square.svg';
import type { TeamMinimal } from '../../../types/prisma/Team/team-minimal';

export type TeamPopoverCardProps = { team: TeamMinimal; triggerClassName?: string; children: React.ReactNode };
export default function TeamPopoverCard({ team, triggerClassName, children }: TeamPopoverCardProps) {
  const { format } = useTranslation();
  // TODO:
  // const [getTeam, { data }] = useGetTeamPopoverLazyQuery({
  //   variables: { id: teamId },
  // });

  // const team = data?.team[0];

  return (
    <Popover forcePlacement={true} crossAxis={false} placementOffset={16} placement="right-start">
      <PopoverTrigger className={triggerClassName}>{children}</PopoverTrigger>
      <PopoverContent popoverClassName="rounded-t-2xl md:rounded-2xl bg-[var(--bg-main)]">
        {team ? (
          <PopoverCard
            link={`/team/${team.slug}`}
            name={team.actor.name}
            avatar={team.actor.avatar}
            banner={team.actor.banner}
          >
            {team.actor.status && (
              <>
                <div className="text-1 line-clamp-6 font-medium">{team.actor.status}</div>
                <hr className="my-4 border-[var(--border-3)]" />
              </>
            )}
            {/*             < heading="Actif depuis"> */}
            <div className="flex items-center gap-1.5">
              <OkampusLogo className="h-4 w-4" />
              <div className="font-medium text-sm capitalize">{format('weekDay', new Date(team.createdAt))}</div>
            </div>
            {/*             </> */}
          </PopoverCard>
        ) : (
          <div className="flex flex-col w-80 rounded-lg overflow-hidden">
            <div className="h-24 bg-[var(--bg-main)]" />
            <div className="bg-1 text-0 p-4 relative flex flex-col gap-1">
              <Skeleton className="absolute -translate-y-[50%] rounded-[50%] h-14 w-14 border-4 border-[var(--bg-1)]" />
              <Skeleton className="-mt-4 h-6 w-64" />
              <hr className="my-1 border-[var(--border-3)]" />
              <Skeleton className="w-32 h-3" />
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
