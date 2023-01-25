import { Actor, ActorImageUploadProps, TenantCore, ImageUpload, ActorImage } from '@okampus/api/dal';
import { ActorKind, S3Buckets, ActorImageType } from '@okampus/shared/enums';
import { MulterFileType } from '@okampus/shared/types';
import { UploadService } from '../../features/uploads/upload.service';

export async function addImagesToActor(
  actor: Actor,
  actorKind: ActorKind,
  images: ActorImageUploadProps,
  tenant: TenantCore,
  uploadService: UploadService
): Promise<Actor> {
  const bucket = actorKind === ActorKind.Individual ? S3Buckets.UserImages : S3Buckets.OrgImages;
  type ImageTypes = ActorImageType.Avatar | ActorImageType.AvatarDarkMode | ActorImageType.Banner;
  const imageKeys: ImageTypes[] = [ActorImageType.Avatar, ActorImageType.AvatarDarkMode, ActorImageType.Banner];

  const wrapPromise = (key: ActorImageType, image: MulterFileType) =>
    uploadService.createImageUpload(tenant, image, bucket).then((upload) => [key, upload] as [ImageTypes, ImageUpload]);

  const uploadImages: Promise<[ImageTypes, ImageUpload]>[] = [];

  // @ts-expect-error - TS doesn't know that the keys are in the array
  for (const key of imageKeys) if (images[key]) uploadImages.push(wrapPromise(key as ImageTypes, images[key]));

  const imageUploads = await Promise.all(uploadImages);
  imageUploads.map(([key, upload]) =>
    actor.actorImages.add(new ActorImage({ actor, image: upload, type: key, tenant }))
  );

  return actor;
}
