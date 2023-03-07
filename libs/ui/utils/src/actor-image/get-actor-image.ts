import { actorImageBareFragment, ActorImageType, getFragmentData } from '@okampus/shared/graphql';
import type { ActorImageBase } from './actor-image-base.type';

export function getAvatar(actorImageFragments?: ActorImageBase[]) {
  if (!actorImageFragments) return;

  const actorImages = actorImageFragments.map((actorImageFragment) => {
    const actorImageBare = getFragmentData(actorImageBareFragment, actorImageFragment);
    return { type: actorImageBare.type, image: actorImageBare.image };
  });

  const darkMode = localStorage.getItem('theme') === 'dark';
  if (darkMode) {
    const darkAvatar = actorImages.find((actorImage) => actorImage.type === ActorImageType.AvatarDarkMode);
    if (darkAvatar) return darkAvatar.image?.url;
  }
  return actorImages.find((actorImage) => actorImage.type === ActorImageType.Avatar)?.image?.url;
}

export function getBanner(actorImageFragments?: ActorImageBase[]) {
  if (!actorImageFragments) return;

  return actorImageFragments
    .map((actorImageFragment) => {
      const actorImageBare = getFragmentData(actorImageBareFragment, actorImageFragment);
      return { type: actorImageBare.type, image: actorImageBare.image };
    })
    .find((actorImage) => actorImage.type === ActorImageType.Banner)?.image?.url;
}

export function getProfileImages(actorImageFragments?: ActorImageBase[]): string[] {
  if (!actorImageFragments) return [];

  return actorImageFragments
    .map((actorImageFragment) => {
      const actorImageBare = getFragmentData(actorImageBareFragment, actorImageFragment);
      return { type: actorImageBare.type, image: actorImageBare.image };
    })
    .filter((actorImage) => actorImage.type === ActorImageType.Profile)
    .map((actorImage) => actorImage.image?.url ?? '')
    .filter(Boolean);
}
