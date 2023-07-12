import { ActorImageType } from '@okampus/shared/enums';
import type { ActorImageBaseInfo } from '@okampus/shared/graphql';

export function getAvatar(actorImages?: ActorImageBaseInfo[]) {
  if (!actorImages || actorImages.length === 0) return;
  const darkMode = localStorage.getItem('theme') === 'dark';
  if (darkMode) {
    const darkAvatar = actorImages
      .filter((actorImage) => actorImage.type === ActorImageType.AvatarDarkMode)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (darkAvatar) return darkAvatar.image.url;
  }

  const avatar = actorImages
    .filter((actorImage) => actorImage.type === ActorImageType.Avatar)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  if (avatar) return avatar.image.url;
  return;
}
