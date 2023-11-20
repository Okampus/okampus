'use client';

import Button from './Button';
import { useMe } from '../../../_hooks/context/useMe';

// import { useDeleteFollowMutation, useInsertFollowMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/enums';

import clsx from 'clsx';
// import { useAtom } from 'jotai';

export type FollowButtonProps = {
  className?: string;
  actorId: bigint;
};

export default function FollowButton({ className, actorId }: FollowButtonProps) {
  const { data: me } = useMe();
  const isFollowing = me.following.find((followed) => followed.followedActorId === actorId);

  // const [insertFollow] = useInsertFollowMutation();
  // const [deleteFollow] = useDeleteFollowMutation();

  return (
    <Button
      active={!!isFollowing}
      className={clsx(className, '!w-44')}
      hoverContent={isFollowing ? <span className="text-[var(--danger)]">Ne plus suivre</span> : null}
      type={ActionType.Action}
      // action={{
      //   label: isFollowing ? 'Suivi' : 'Suivre',
      //   type={ActionType.Action}

      //   // TODO
      //   // linkOrActionOrMenu: () => {
      //   //   isFollowing
      //   //     ? deleteFollow({
      //   //         variables: { id: isFollowing.id },
      //   //         onCompleted: ({ deleteFollowByPk }) => {
      //   //           if (deleteFollowByPk === null) return;

      //   //           updateFragment<MeInfo>({
      //   //             __typename: 'Me',
      //   //             fragment: MeFragment,
      //   //             where: { slug: me.slug },
      //   //             update: (data) =>
      //   //               produce(data, (data) => {
      //   //                 data.following = data.following.filter((follow) => follow.id !== deleteFollowByPk.id);
      //   //               }),
      //   //           });

      //   //           setNotification({ message: `Vous ne suivez plus ${deleteFollowByPk?.actor.name} !` });
      //   //         },
      //   //       })
      //   //     : insertFollow({
      //   //         variables: { object: { followedActorId: actorId } },
      //   //         onCompleted: ({ insertFollowOne }) => {
      //   //           if (!insertFollowOne) return;

      //   //           updateFragment<MeInfo>({
      //   //             __typename: 'Me',
      //   //             fragment: MeFragment,
      //   //             where: { slug: me.slug },
      //   //             update: (data) =>
      //   //               produce(data, (data) => {
      //   //                 data.following.push(insertFollowOne);
      //   //               }),
      //   //           });

      //   //           setNotification({ message: `Vous suivez désormais ${insertFollowOne.actor.name} !` });
      //   //         },
      //   //       });
      //   // },
      // }}
    >
      {isFollowing ? 'Suivi' : 'Suivre'}
    </Button>
  );
}
