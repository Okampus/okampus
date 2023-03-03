import { PopoverCard } from './PopoverCard';
import { CardSkeleton } from '../Skeleton/CardSkeleton';
import { useQuery } from '@apollo/client';
import { getFragmentData, getUserMembershipsByIdQuery, userMembershipsFragment } from '@okampus/shared/graphql';
import { formatDateStandard } from '@okampus/shared/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';
import { getAvatar, getBanner } from '@okampus/ui/utils';

export type UserCardProps = {
  userId: string;
  children: React.ReactNode;
};

export function UserCard({ userId, children }: UserCardProps) {
  const { data } = useQuery(getUserMembershipsByIdQuery, { variables: { id: userId } });

  const user = getFragmentData(userMembershipsFragment, data?.userById);
  const avatar = { src: getAvatar(user?.actor?.actorImages) };
  const banner = { src: getBanner(user?.actor?.actorImages) };

  return (
    <Popover forcePlacement={true} crossAxis={false} placementOffset={16}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent popoverClassName="!p-0 bg-1 ">
        {user && user.actor ? (
          <PopoverCard link={`/user/${user.actor.slug}`} name={user.actor.name} avatar={avatar} banner={banner}>
            {user.actor.bio && (
              <>
                <div className="text-2">{user.actor.bio}</div>
                <hr className="my-2 border-color-3" />
              </>
            )}
            <div className="text-1 italic text-sm">Actif depuis le {formatDateStandard(user.createdAt)}</div>
          </PopoverCard>
        ) : (
          <CardSkeleton />
        )}
      </PopoverContent>
    </Popover>
  );
}
