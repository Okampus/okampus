import { ProfileBase } from '../ProfileBase';
import { ActionButton } from '@okampus/ui/atoms';

import { getAvatar, getBanner } from '@okampus/ui/utils';
import { getColorHexFromData } from '@okampus/shared/utils';
import { ProfileSkeleton } from '@okampus/ui/molecules';
import { useMe, useUser } from '@okampus/ui/hooks';

import { useNavigate } from 'react-router-dom';

export function UserProfile() {
  const navigate = useNavigate();
  const { me } = useMe();
  const { user } = useUser();

  const color = getColorHexFromData(user?.actor?.name);

  const avatar = { src: getAvatar(user?.actor?.actorImages) };
  const banner = { src: getBanner(user?.actor?.actorImages) };

  return user && user.actor ? (
    <ProfileBase
      color={color}
      name={user.actor.name}
      avatar={avatar}
      type={user.scopeRole}
      banner={banner}
      details={<div className="tagline">{user?.actor.bio}</div>}
    >
      {/* Action list */}
      <div className="button-list">
        <ActionButton onClick={() => ({})}>Follow</ActionButton>
        {/* {isManager && (
          <ActionButton
            variant={ActionType.Do}
            onClick={() => navigate(`/manage/${user?.actor?.slug}`)}
            icon={<EditOutlinedIcon height={20} />}
          >
            Gérer le profil
          </ActionButton>
        )} */}
      </div>
    </ProfileBase>
  ) : (
    <ProfileSkeleton />
  );
}
