import ActionButton from './ActionButton';
import { notificationAtom } from '../../../_context/global';
import { useMe } from '../../../_context/navigation';

import { updateFragment } from '../../../../utils/apollo/update-fragment';
import { MeFragment } from '../../../../utils/apollo/fragments';

import { useDeleteFollowMutation, useInsertFollowMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import clsx from 'clsx';
import { useAtom } from 'jotai';
import { produce } from 'immer';

import type { MeInfo } from '../../../../utils/apollo/fragments';

export type FollowButtonProps = {
  className?: string;
  actorId: string;
  small?: boolean;
};

export default function FollowButton({ className, actorId, small }: FollowButtonProps) {
  const [, setNotification] = useAtom(notificationAtom);

  const me = useMe();
  const isFollowing = me.following.find((followed) => followed.actor.id === actorId);

  const [insertFollow] = useInsertFollowMutation();
  const [deleteFollow] = useDeleteFollowMutation();

  return (
    <ActionButton
      small={small}
      className={clsx(className, '!w-44')}
      action={{
        hoverLabel: isFollowing ? <span className="text-[var(--danger)]">Ne plus suivre</span> : null,
        active: !!isFollowing,
        label: isFollowing ? 'Suivi' : 'Suivre',
        type: ActionType.Action,
        linkOrActionOrMenu: () => {
          isFollowing
            ? deleteFollow({
                variables: { id: isFollowing.id },
                onCompleted: ({ deleteFollowByPk }) => {
                  if (deleteFollowByPk === null) return;

                  updateFragment<MeInfo>({
                    __typename: 'Me',
                    fragment: MeFragment,
                    where: { slug: me.slug },
                    update: (data) =>
                      produce(data, (data) => {
                        data.following = data.following.filter((follow) => follow.id !== deleteFollowByPk.id);
                      }),
                  });

                  setNotification({ message: `Vous ne suivez plus ${deleteFollowByPk?.actor.name} !` });
                },
              })
            : insertFollow({
                variables: { object: { followedActorId: actorId } },
                onCompleted: ({ insertFollowOne }) => {
                  if (!insertFollowOne) return;

                  updateFragment<MeInfo>({
                    __typename: 'Me',
                    fragment: MeFragment,
                    where: { slug: me.slug },
                    update: (data) =>
                      produce(data, (data) => {
                        data.following.push(insertFollowOne);
                      }),
                  });

                  setNotification({ message: `Vous suivez désormais ${insertFollowOne.actor.name} !` });
                },
              });
        },
      }}
    />
  );
}
