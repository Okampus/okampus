import { AVATAR_USER_ROUNDED, AVATAR_TEAM_ROUNDED, AVATAR_TENANT_ROUNDED, THEME_COOKIE } from '@okampus/shared/consts';
import { ActorImageType } from '@okampus/shared/enums';

import Cookies from 'universal-cookie';

import type { ActorImageBaseInfo } from '@okampus/shared/graphql';

export function getAvatar(actorImages?: ActorImageBaseInfo[]) {
  const cookieStore = new Cookies();
  if (!actorImages || actorImages.length === 0) return;
  const darkMode = cookieStore.get(THEME_COOKIE) === 'dark';
  if (darkMode) {
    const darkAvatar = actorImages
      .filter((actorImage) => actorImage.type === ActorImageType.AvatarDarkMode)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (darkAvatar) return darkAvatar;
  }

  const avatar = actorImages
    .filter((actorImage) => actorImage.type === ActorImageType.Avatar)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  if (avatar) return avatar;

  return null;
}

export function getAvatarRounded(type?: 'user' | 'team' | 'tenant') {
  if (type === 'user') return AVATAR_USER_ROUNDED;
  if (type === 'team') return AVATAR_TEAM_ROUNDED;
  if (type === 'tenant') return AVATAR_TENANT_ROUNDED;
  return 0;
}
