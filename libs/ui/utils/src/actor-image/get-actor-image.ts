import { ActorImageType } from '@okampus/shared/enums';
import type { ActorImageBaseInfo } from '@okampus/shared/graphql';

export function getAvatar(actorImages?: ActorImageBaseInfo[]) {
  if (!actorImages || actorImages.length === 0) return;

  const darkMode = localStorage.getItem('theme') === 'dark';
  if (darkMode) {
    const darkAvatar = actorImages.find((actorImage) => actorImage.type === ActorImageType.AvatarDarkMode);
    if (darkAvatar) return darkAvatar.fileUpload.url;
  }

  const avatar = actorImages.find((actorImage) => actorImage.type === ActorImageType.Avatar);
  if (avatar) return avatar.fileUpload.url;

  return;
}

export function getBanner(actorImages?: ActorImageBaseInfo[]) {
  if (!actorImages || actorImages.length === 0) return;

  const banner = actorImages.find((actorImage) => actorImage.type === ActorImageType.Banner);
  if (banner) return banner.fileUpload.url;
  return;
}
