import { ActorImageType } from '@okampus/shared/enums';
import type { ActorImageBaseInfo } from '@okampus/shared/graphql';

export function getBanner(actorImages?: ActorImageBaseInfo[]) {
  if (!actorImages || actorImages.length === 0) return;

  const banner = actorImages
    .filter((actorImage) => actorImage.type === ActorImageType.Banner)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  if (banner) return banner.fileUpload.url;
  return;
}
