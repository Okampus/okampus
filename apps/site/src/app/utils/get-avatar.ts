import { actorImageBareFragment, ActorImageType, getFragmentData } from '@okampus/shared/graphql';
import type { ActorImageBareInfoFragment } from '@okampus/shared/graphql';

type ActorImageBase = {
  ' $fragmentRefs'?: {
    ActorImageBareInfoFragment: ActorImageBareInfoFragment;
  };
};

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
