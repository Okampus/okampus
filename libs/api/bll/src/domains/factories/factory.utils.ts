import { ActorImage, DocumentEdit, DocumentUpload } from '@okampus/api/dal';
import { ActorKind, S3Buckets, ActorImageType } from '@okampus/shared/enums';
import { isEmpty, isNotNull, keepDefined } from '@okampus/shared/utils';

import type {
  Actor,
  ActorImageUploadProps,
  TenantCore,
  ImageUpload,
  TenantDocument,
  Individual,
} from '@okampus/api/dal';
import type { ActorProps, CreateDocumentDto } from '@okampus/shared/dtos';
import type { MulterFileType } from '@okampus/shared/types';
import type { UploadService } from '../../features/upload/upload.service';

export async function addImagesToActor(
  actor: Actor,
  actorKind: ActorKind,
  images: ActorImageUploadProps,
  createdBy: Individual | null,
  tenant: TenantCore,
  uploadService: UploadService
): Promise<Actor> {
  const bucket = actorKind === ActorKind.Individual ? S3Buckets.UserImages : S3Buckets.OrgImages;
  type ImageTypes = ActorImageType.Avatar | ActorImageType.AvatarDarkMode | ActorImageType.Banner;
  const imageKeys: ImageTypes[] = [ActorImageType.Avatar, ActorImageType.AvatarDarkMode, ActorImageType.Banner];

  const wrapPromise = (key: ImageTypes, image: MulterFileType): Promise<[key: ImageTypes, upload: ImageUpload]> =>
    uploadService.createImageUpload(tenant, image, bucket).then((upload) => [key, upload]);

  const uploadPromises: Promise<[ImageTypes, ImageUpload]>[] = [];

  for (const key of imageKeys) {
    const image = images[key];
    if (isNotNull(image)) uploadPromises.push(wrapPromise(key, image));
  }

  const imageUploads = await Promise.all(uploadPromises);

  const actorImages = await actor.actorImages.loadItems();
  imageUploads.map(([key, upload]) => {
    const existingImage = actorImages.find((image) => image.type === key);
    if (existingImage) existingImage.lastActiveDate = new Date();
    actor.actorImages.add(new ActorImage({ actor, image: upload, type: key, createdBy, tenant }));
  });

  return actor;
}

export function extractActor(props: ActorProps) {
  const { name, bio, primaryEmail, slug } = props;
  return keepDefined({ name, bio, primaryEmail, slug });
}

export function separateActorProps<T extends Partial<ActorProps>>(props: T) {
  const { name, bio, primaryEmail, slug, ...otherProps } = props;
  const actor = keepDefined({ name, bio, primaryEmail, slug });
  return {
    ...(isEmpty(actor) ? {} : { actor }),
    ...otherProps,
  };
}

export async function addDocumentEditToDocument(
  document: TenantDocument,
  documentEdit: Partial<CreateDocumentDto>,
  documentFile: MulterFileType | DocumentUpload,
  tenant: TenantCore,
  createdBy: Individual | null,
  uploadService: UploadService
) {
  const newVersion =
    documentFile instanceof DocumentUpload
      ? documentFile
      : await uploadService.createDocumentUpload(tenant, documentFile, S3Buckets.OrgDocuments);

  const edit = new DocumentEdit({
    yearVersion: documentEdit.yearVersion ?? null,
    linkedUgc: document,
    newVersion,
    createdBy,
    tenant,
  });

  document.edits.add(edit);
  if (documentEdit.name) document.name = documentEdit.name;
  if (documentEdit.description) document.description = documentEdit.description;

  return document;
}
