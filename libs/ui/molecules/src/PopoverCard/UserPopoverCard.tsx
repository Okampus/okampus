import { PopoverCard } from './PopoverCard';
import { CardSkeleton } from '../Skeleton/CardSkeleton';

import { AVATAR_USER_ROUNDED, USER_ROUTE } from '@okampus/shared/consts';
import { useTypedLazyQuery, userWithMembershipsInfo } from '@okampus/shared/graphql';
import { formatDateStandard } from '@okampus/shared/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';
import { getAvatar, getBanner } from '@okampus/ui/utils';

import type { UserWithMembershipsInfo } from '@okampus/shared/graphql';

export type UserPopoverCardProps = {
  userId: string;
  triggerClassName?: string;
  children: React.ReactNode;
};

const renderContent = (user?: UserWithMembershipsInfo) => {
  if (!user) return <CardSkeleton />;

  const avatar = { src: getAvatar(user.individualById?.actor?.actorImages), rounded: AVATAR_USER_ROUNDED };
  const banner = { src: getBanner(user.individualById?.actor?.actorImages) };

  return (
    <PopoverCard
      link={USER_ROUTE(user.individualById?.actor?.slug)}
      name={user.individualById?.actor?.name}
      avatar={avatar}
      banner={banner}
    >
      {user.individualById?.actor?.bio && (
        <>
          <div className="text-2">{user.individualById?.actor?.bio}</div>
          <hr className="my-2 border-color-3" />
        </>
      )}
      <div className="text-1 italic text-sm">
        Actif depuis le {formatDateStandard(user.individualById?.actor?.createdAt as string)}
      </div>
    </PopoverCard>
  );
};

export function UserPopoverCard({ userId, triggerClassName, children }: UserPopoverCardProps) {
  const [getUser, { data }] = useTypedLazyQuery({
    userInfo: [{ where: { id: { _eq: userId } }, limit: 1 }, userWithMembershipsInfo],
  });

  return (
    <Popover forcePlacement={true} crossAxis={false} placementOffset={16} placement="right-start">
      <PopoverTrigger className={triggerClassName} onClick={() => getUser()}>
        {children}
      </PopoverTrigger>
      <PopoverContent popoverClassName="rounded-2xl bg-1">{renderContent(data?.userInfo?.[0])}</PopoverContent>
    </Popover>
  );
}
