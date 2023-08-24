import ActionButton from './ActionButton';
import { useMe } from '../../../context/navigation';

import { useDeleteFollowMutation, useInsertFollowMutation } from '@okampus/shared/graphql';

import clsx from 'clsx';

export type FollowButtonProps = {
  className?: string;
  actorId: string;
  small?: boolean;
};

export default function FollowButton({ className, actorId, small }: FollowButtonProps) {
  const me = useMe();

  const isFollowing = me.user.individual.following.find((followedActor) => followedActor.id === actorId);

  const [insertFollow] = useInsertFollowMutation();
  const [deleteFollow] = useDeleteFollowMutation();

  return (
    <ActionButton
      small={small}
      className={clsx(className, '!w-36')}
      action={{
        active: !!isFollowing,
        label: 'Suivre',
        linkOrActionOrMenu: () =>
          isFollowing
            ? deleteFollow({ variables: { id: actorId } })
            : insertFollow({ variables: { object: { followedActorId: actorId } } }),
      }}
    />
  );
}
