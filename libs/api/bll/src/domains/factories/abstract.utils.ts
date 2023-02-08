import { ActorImage, DocumentEdit, DocumentUpload } from '@okampus/api/dal';
import { ActorKind, S3Buckets, ActorImageType } from '@okampus/shared/enums';
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

  const wrapPromise = (key: ActorImageType, image: MulterFileType) =>
    uploadService.createImageUpload(tenant, image, bucket).then((upload) => [key, upload] as [ImageTypes, ImageUpload]);

  const uploadPromises: Promise<[ImageTypes, ImageUpload]>[] = [];

  // @ts-expect-error - TS doesn't know that the keys are in the array
  for (const key of imageKeys) if (images[key]) uploadPromises.push(wrapPromise(key as ImageTypes, images[key]));

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
