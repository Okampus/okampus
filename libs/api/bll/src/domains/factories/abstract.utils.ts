import { ActorImage, DocumentEdit, DocumentUpload } from '@okampus/api/dal';
import { ActorKind, S3Buckets, ActorImageType } from '@okampus/shared/enums';
import { isNotNull } from '@okampus/shared/utils';

import type {
  Actor,
  ActorImageUploadProps,
  TenantCore,
  ImageUpload,
  TenantDocument,
  Individual,
} from '@okampus/api/dal';
import type { CreateDocumentDto } from '@okampus/shared/dtos';
import type { MulterFileType } from '@okampus/shared/types';
import type { UploadService } from '../../features/upload/upload.service';

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

  const wrapPromise = (key: ImageTypes, image: MulterFileType): Promise<[key: ImageTypes, upload: ImageUpload]> =>
    uploadService.createImageUpload(tenant, image, bucket).then((upload) => [key, upload]);

  const uploadPromises: Promise<[ImageTypes, ImageUpload]>[] = [];

  for (const key of imageKeys) {
    const image = images[key];
    if (isNotNull(image)) uploadPromises.push(wrapPromise(key, image));
  }

  const imageUploads = await Promise.all(uploadPromises);
  imageUploads.map(([key, upload]) =>
    actor.actorImages.add(new ActorImage({ actor, image: upload, type: key, tenant }))
  );

  return actor;
}

export async function addDocumentEditToDocument(
  document: TenantDocument,
  documentEdit: Partial<CreateDocumentDto>,
  documentFile: MulterFileType | DocumentUpload,
  tenant: TenantCore,
  realAuthor: Individual,
  uploadService: UploadService
) {
  const documentUpload =
    documentFile instanceof DocumentUpload
      ? documentFile
      : await uploadService.createDocumentUpload(tenant, documentFile, S3Buckets.OrgDocuments);

  const edit = new DocumentEdit({
    yearVersion: documentEdit.yearVersion,
    documentUpload,
    editedBy: realAuthor,
    order: document.edits.length,
    tenant,
  });

  document.edits.add(edit);
  if (documentEdit.name) document.name = documentEdit.name;
  if (documentEdit.description) document.description = documentEdit.description;

  return document;
}
