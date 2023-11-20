'use client';

import PopoverCard from './PopoverCard';

import Popover from '../../_components/atoms/Popover/Popover';
import PopoverContent from '../../_components/atoms/Popover/PopoverContent';
import PopoverTrigger from '../../_components/atoms/Popover/PopoverTrigger';
import Skeleton from '../../_components/atoms/Skeleton/Skeleton';

import { useTranslation } from '../../_hooks/context/useTranslation';
import { jsonFetcher } from '../../../utils/json-fetcher';
import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus-square.svg';

import useSWRMutation from 'swr/mutation';

import type { UserDetails } from '../../../types/prisma/User/user-details';

export type UserPopoverCardProps = { userId: string | bigint; triggerClassName?: string; children: React.ReactNode };
export default function UserPopoverCard({ userId, triggerClassName, children }: UserPopoverCardProps) {
  const { format } = useTranslation();
  const { data, trigger } = useSWRMutation<UserDetails>(`/api/user/${userId}`, (url: string) => jsonFetcher(url));

  return (
    <Popover forcePlacement={true} crossAxis={false} placementOffset={16} placement="right-start">
      <PopoverTrigger className={triggerClassName} onClick={() => trigger()}>
        {children}
      </PopoverTrigger>
      <PopoverContent popoverClassName="rounded-t-2xl md:rounded-2xl bg-1">
        {data ? (
          <PopoverCard
            link={`/user/${data.slug}`}
            name={data.actor.name}
            avatar={data.actor.avatar}
            banner={data.actor.banner}
          >
            {data.actor?.bio && <div className="text-2">{data.actor.bio}</div>}
            <hr className="my-2 border-[var(--border-3)]" />
            {/*             < heading="Actif depuis"> */}
            <div className="flex items-center gap-1.5">
              <OkampusLogo className="h-5 w-5" />
              <div className="font-medium text-sm capitalize">{format('weekDay', new Date(data.createdAt))}</div>
            </div>
            {/*             </> */}
          </PopoverCard>
        ) : (
          <div className="flex flex-col w-full md:w-80 rounded-lg overflow-hidden">
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
