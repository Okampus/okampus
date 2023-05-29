import { AVATAR_USER_ROUNDED, ME_ROUTE, ME_ROUTES } from '@okampus/shared/consts';

import { AvatarImage } from '@okampus/ui/atoms';
import { useCurrentUser } from '@okampus/ui/hooks';
import { TabsTopbarView } from '@okampus/ui/templates';
import { getAvatar } from '@okampus/ui/utils';

export function MyView() {
  const { currentUser } = useCurrentUser();

  if (!currentUser || !currentUser?.individualById || !currentUser?.individualById?.actor) return null;

  const avatar = {
    src: getAvatar(currentUser.individualById.actor.actorImages),
    rounded: AVATAR_USER_ROUNDED,
    size: 16,
    name: currentUser.individualById.actor.name,
  };

  const menus = [
    {
      key: ME_ROUTES.PROFILE,
      label: 'Profil',
      element: () => (
        // <EmptyState title="Aucune activité pour le moment." />
        <div className="h-full w-full flex items-center justify-center text-0 font-semibold text-4xl pt-20">
          Aucune activité pour le moment.
        </div>
      ),
    },
  ];

  return (
    <TabsTopbarView
      menus={menus}
      basePath={ME_ROUTE}
      topbarPrefix={
        <div className="flex gap-4 items-center">
          <AvatarImage {...avatar} />
          <div className="title">Mon compte</div>
        </div>
      }
    />
  );
  // return (
  //   <ManageProfileBase
  //     actorImageEdit={(image, actorImageType) => {
  //       if (currentUser) {
  //         const id = currentUser.id as string;
  //         if (image)
  //           updateUser({
  //             variables: {
  //               // ...(actorImageType === ActorImageType.Avatar ? { avatar: image } : { banner: image }),
  //               id,
  //               update: {
  //                 actor_images: {},
  //               },
  //             },
  //           });
  //         else deactivateImage({ variables: { id, now: new Date().toISOString() } });
  //       }
  //     }}
  //     color={color}
  //     tabs={menus}
  //     name={currentUser.individualById.actor.name}
  //     avatar={avatar}
  //     banner={banner}
  //     details={details}
  //     // buttonList={buttonList}
  //     switchTabRoute={ME_TAB_ROUTE}
  //     publicRoute={publicRoute}
  //   />
  // );
}
