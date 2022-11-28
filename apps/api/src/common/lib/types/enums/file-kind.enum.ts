import { registerEnumType } from '@nestjs/graphql';

export enum FileKind {
  UserImage = 'UserImage',
  TeamImage = 'TeamImage',
  TenantImage = 'TenantImage',
  Attachment = 'Attachment',
  Tenant = 'Tenant',
  StudyDoc = 'StudyDoc',
  InfoDoc = 'InfoDoc',
  TeamFile = 'TeamFile',
  TeamGallery = 'TeamGallery',
  TeamReceipt = 'TeamReceipt',
}

registerEnumType(FileKind, { name: 'FileKind' });
