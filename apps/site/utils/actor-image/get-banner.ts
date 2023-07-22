import { ActorImageType } from '@okampus/shared/enums';
import type { ActorImageBaseInfo } from '@okampus/shared/graphql';

export function getBanner(actorImages?: ActorImageBaseInfo[]) {
  if (!actorImages || actorImages.length === 0) return;

  const banner = actorImages.find((actorImage) => actorImage.type === ActorImageType.Banner);
  if (banner) return banner;
  return;
}
