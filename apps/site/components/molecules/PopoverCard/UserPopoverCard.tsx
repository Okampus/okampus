'use client';

import PopoverCard from './PopoverCard';

import SimpleList from '../List/SimpleList';
import Popover from '../../atoms/Popup/Popover/Popover';
import PopoverContent from '../../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../../atoms/Popup/Popover/PopoverTrigger';
import Skeleton from '../../atoms/Skeleton/Skeleton';

import { useTranslation } from '../../../hooks/context/useTranslation';

import { useGetUserPopoverLazyQuery } from '@okampus/shared/graphql';

import { USER_ROUTE } from '@okampus/shared/consts';

import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus.svg';

export type UserPopoverCardProps = { userId: string; triggerClassName?: string; children: React.ReactNode };
export default function UserPopoverCard({ userId, triggerClassName, children }: UserPopoverCardProps) {
  const { format } = useTranslation();

  const [getUser, { data }] = useGetUserPopoverLazyQuery({
    variables: { id: userId },
  });

  if (!userId) return <>{children}</>;

  const user = data?.userByPk;
  return (
    <Popover forcePlacement={true} crossAxis={false} placementOffset={16} placement="right-start">
      <PopoverTrigger className={triggerClassName} onClick={() => getUser()}>
        {children}
      </PopoverTrigger>
      <PopoverContent popoverClassName="rounded-t-2xl md:rounded-2xl bg-1">
        {user ? (
          <PopoverCard
            link={USER_ROUTE(user.slug)}
            name={user.actor.name}
            avatar={user.actor.avatar}
            banner={user.actor.banner}
            type="user"
          >
            {user.actor?.bio && <div className="text-2">{user.actor.bio}</div>}
            <hr className="my-2 border-color-3" />
            <SimpleList heading="Actif depuis">
              <div className="flex items-center gap-1.5">
                <OkampusLogo className="h-5 w-5" />
                <div className="font-medium text-sm capitalize">{format('weekDay', new Date(user.createdAt))}</div>
              </div>
            </SimpleList>
          </PopoverCard>
        ) : (
          <div className="flex flex-col w-full md:w-80 rounded-lg overflow-hidden">
            <div className="h-24 bg-0" />
            <div className="bg-1 text-0 p-4 relative flex flex-col gap-1">
              <Skeleton className="absolute -translate-y-[50%] rounded-[50%] h-14 w-14 border-4 border-[var(--bg-1)]" />
              <Skeleton className="-mt-4 h-6 w-64" />
              <hr className="my-1 border-color-3" />
              <Skeleton className="w-32 h-3" />
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
