import { ActorImageType } from '@okampus/shared/enums';
import type { ActorImageMinimalInfo } from '../../types/features/actor-image.info';

export function getBanner(actorImages?: ActorImageMinimalInfo[]) {
  if (!actorImages || actorImages.length === 0) return;

  const banner = actorImages.find((actorImage) => actorImage.type === ActorImageType.Banner);
  if (banner) return banner;
  return;
}
