import { AVATAR_USER_ROUNDED, AVATAR_TEAM_ROUNDED, AVATAR_TENANT_ROUNDED, THEME_COOKIE } from '@okampus/shared/consts';
import { ActorImageType } from '@okampus/shared/enums';

import Cookies from 'universal-cookie';
import type { ActorImageMinimalInfo } from '../../types/features/actor-image.info';

export function getAvatar(actorImages?: ActorImageMinimalInfo[]) {
  const cookieStore = new Cookies();
  if (!actorImages || actorImages.length === 0) return;
  const darkMode = cookieStore.get(THEME_COOKIE) === 'dark';
  if (darkMode) {
    const darkAvatar = actorImages.find((actorImage) => actorImage.type === ActorImageType.AvatarDarkMode);
    if (darkAvatar) return darkAvatar;
  }

  const avatar = actorImages.find((actorImage) => actorImage.type === ActorImageType.Avatar);

  if (avatar) return avatar;

  return null;
}

export function getAvatarRounded(type?: 'user' | 'team' | 'tenant') {
  if (type === 'user') return AVATAR_USER_ROUNDED;
  if (type === 'team') return AVATAR_TEAM_ROUNDED;
  if (type === 'tenant') return AVATAR_TENANT_ROUNDED;
  return 0;
}
