import ActionButton from './ActionButton';
import { notificationAtom } from '../../../context/global';
import { useMe } from '../../../context/navigation';

import { getUserLoginWhere } from '../../../context/apollo';
import { updateFragment } from '../../../utils/apollo/update-fragment';
import { UserLoginFragment } from '../../../utils/apollo/fragments';
import { useDeleteFollowMutation, useInsertFollowMutation } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';

import clsx from 'clsx';
import { useAtom } from 'jotai';
import { produce } from 'immer';

import type { UserLoginInfo } from '../../../utils/apollo/fragments';

export type FollowButtonProps = {
  className?: string;
  actorId: string;
  small?: boolean;
};

export default function FollowButton({ className, actorId, small }: FollowButtonProps) {
  const [, setNotification] = useAtom(notificationAtom);

  const me = useMe();
  const isFollowing = me.user.following.find((followed) => followed.actor.id === actorId);

  const [insertFollow] = useInsertFollowMutation();
  const [deleteFollow] = useDeleteFollowMutation();

  console.log({ isFollowing }, me.user.following);

  return (
    <ActionButton
      small={small}
      className={clsx(className, '!w-36')}
      action={{
        active: !!isFollowing,
        label: isFollowing ? 'Suivi' : 'Suivre',
        type: ActionType.Action,
        linkOrActionOrMenu: () =>
          isFollowing
            ? deleteFollow({
                variables: { id: isFollowing.id },
                onCompleted: ({ deleteFollowByPk }) => {
                  updateFragment<UserLoginInfo>({
                    __typename: 'UserLogin',
                    fragment: UserLoginFragment,
                    where: getUserLoginWhere(me),
                    update: (data) =>
                      produce(data, (data) => {
                        data.user.following = data.user.following.filter(
                          (follow) => follow.id !== deleteFollowByPk?.id,
                        );
                      }),
                  });

                  setNotification({
                    type: ToastType.Success,
                    message: `Vous ne suivez plus ${deleteFollowByPk?.actor.name} !`,
                  });
                },
              })
            : insertFollow({
                variables: { object: { followedActorId: actorId } },
                onCompleted: ({ insertFollowOne }) => {
                  if (!insertFollowOne) return;

                  updateFragment<UserLoginInfo>({
                    __typename: 'UserLogin',
                    fragment: UserLoginFragment,
                    where: getUserLoginWhere(me),
                    update: (data) =>
                      produce(data, (data) => {
                        data.user.following.push(insertFollowOne);
                      }),
                  });

                  setNotification({
                    type: ToastType.Success,
                    message: `Vous suivez désormais ${insertFollowOne.actor.name} !`,
                  });
                },
              }),
      }}
    />
  );
}
