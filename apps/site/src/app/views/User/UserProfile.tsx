import { ProfileBase } from '../ProfileBase';

import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import { ActionType } from '@okampus/shared/types';
import { getColorHexFromData } from '@okampus/shared/utils';
import { ActionButton, GridLoader } from '@okampus/ui/atoms';
import { useMe, useUser } from '@okampus/ui/hooks';
import { getAvatar, getBanner } from '@okampus/ui/utils';

import { MyRoute } from '#site/app/menus';
import { useNavigate } from 'react-router-dom';

export function UserProfile() {
  const navigate = useNavigate();
  const { me } = useMe();
  const { user } = useUser();

  if (!user || !user.actor) return <GridLoader />;

  const manageRoute = `/me/${MyRoute.Profile}`;
  const isMe = me?.id === user.id;

  const color = getColorHexFromData(user.actor.name);
  const avatar = { src: getAvatar(user.actor.actorImages), rounded: AVATAR_USER_ROUNDED };
  const banner = { src: getBanner(user.actor.actorImages) };

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
      color={color}
      name={user.actor.name}
      avatar={avatar}
      type={user.scopeRole}
      banner={banner}
      buttonList={buttonList}
      details={user.actor.bio && <div className="tagline">{user.actor.bio}</div>}
    >
      {/* <div className="flex flex-col gap-4 px-view"> */}
      <div className="h-full w-full flex items-center justify-center px-view text-0 font-semibold text-4xl pt-20">
        Aucune activité pour le moment.
      </div>
      {/* <TextSection title="À propos">{user.actor.bio}</TextSection> */}
      {/* <TagGroup limit={5} tags={user.actor.tags.map((tag) => ({ label: tag.name, slug: tag.slug }))} /> */}
      {/* </div> */}
    </ProfileBase>
  );
}
