'use client';

import PopoverCard from './PopoverCard';

import GroupItem from '../../atoms/Item/GroupItem';
import Popover from '../../atoms/Popup/Popover/Popover';
import PopoverContent from '../../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../../atoms/Popup/Popover/PopoverTrigger';
import Skeleton from '../../atoms/Skeleton/Skeleton';

import { useTranslation } from '../../../hooks/context/useTranslation';
import { getAvatar } from '../../../utils/actor-image/get-avatar';
import { getBanner } from '../../../utils/actor-image/get-banner';

import { USER_ROUTE } from '@okampus/shared/consts';
import { useTypedLazyQuery, userWithMembershipsInfo } from '@okampus/shared/graphql';

import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus.svg';

export type UserPopoverCardProps = { userId?: string; triggerClassName?: string; children: React.ReactNode };
export default function UserPopoverCard({ userId, triggerClassName, children }: UserPopoverCardProps) {
  const { format } = useTranslation();

  const [getUser, { data }] = useTypedLazyQuery({
    user: [{ where: { id: { _eq: userId } }, limit: 1 }, userWithMembershipsInfo],
  });

  if (!userId) return <>{children}</>;

  const user = data?.user?.[0];
  return (
    <Popover forcePlacement={true} crossAxis={false} placementOffset={16} placement="right-start">
      <PopoverTrigger className={triggerClassName} onClick={() => getUser()}>
        {children}
      </PopoverTrigger>
      <PopoverContent popoverClassName="rounded-2xl bg-1">
        {user ? (
          <PopoverCard
            link={USER_ROUTE(user.individual?.actor?.slug)}
            name={user.individual?.actor?.name}
            avatar={getAvatar(user.individual?.actor?.actorImages)?.image.url}
            banner={getBanner(user.individual?.actor?.actorImages)?.image.url}
            type="user"
          >
            {user.individual?.actor?.bio && <div className="text-2">{user.individual?.actor?.bio}</div>}
            <hr className="my-2 border-color-3" />
            <GroupItem heading="Actif depuis">
              <div className="flex items-center gap-1.5">
                <OkampusLogo className="h-5 w-5" />
                <div className="font-medium text-sm capitalize">{format('weekDay', new Date(user.createdAt))}</div>
              </div>
            </GroupItem>
          </PopoverCard>
        ) : (
          <div className="flex flex-col w-80 rounded-lg overflow-hidden">
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