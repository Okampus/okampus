import { ProfileBase } from '../ProfileBase';

import { AVATAR_USER_ROUNDED, ME_ROUTE, ME_ROUTES, USER_ROUTES, USER_TAB_ROUTE } from '@okampus/shared/consts';
import { ActionType } from '@okampus/shared/types';
import { getColorHexFromData } from '@okampus/shared/utils';
import { ActionButton, GridLoader } from '@okampus/ui/atoms';
import { useMe, useUser } from '@okampus/ui/hooks';
import { getAvatar, getBanner } from '@okampus/ui/utils';

import { useNavigate } from 'react-router-dom';

export function UserProfile() {
  const navigate = useNavigate();
  const { me } = useMe();
  const { user } = useUser();

  if (!user || !user.actor) return <GridLoader />;

  const manageRoute = `${ME_ROUTE}/${ME_ROUTES.PROFILE}`;
  const isMe = me?.id === user.id;

  const color = getColorHexFromData(user.actor.name);
  const avatar = { src: getAvatar(user.actor.actorImages), rounded: AVATAR_USER_ROUNDED };
  const banner = { src: getBanner(user.actor.actorImages) };
  const menus = [
    {
      key: USER_ROUTES.PROFILE,
      label: 'Profil',
      element: (
        <div className="h-full w-full flex items-center justify-center p-view text-0 font-semibold text-4xl pt-20">
          Aucune activité pour le moment.
        </div>
      ),
    },
  ];
  const buttonList = (
    <>
      <ActionButton onClick={() => ({})}>S'abonner</ActionButton>
      {isMe && (
        <ActionButton variant={ActionType.Do} onClick={() => navigate(manageRoute)}>
          Gérer le profil
        </ActionButton>
      )}
    </>
  );

  return (
    <ProfileBase
      switchTabRoute={(tab) => USER_TAB_ROUTE(user.actor?.slug, tab)}
      tabs={menus}
      avatar={avatar}
      banner={banner}
      color={color}
      name={user.actor.name}
      details={user.actor.bio && <div className="tagline">{user.actor.bio}</div>}
      buttonList={buttonList}
    />
  );
}
