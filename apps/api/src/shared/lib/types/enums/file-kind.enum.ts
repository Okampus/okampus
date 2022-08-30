import { registerEnumType } from '@nestjs/graphql';

export enum FileKind {
  ProfileImage = 'ProfileImage',
  InfoDoc = 'InfoDoc',
  Attachment = 'Attachment',
  StudyDoc = 'StudyDoc',
  TeamFile = 'TeamFile',
  TeamGallery = 'TeamGallery',
  TeamReceipt = 'TeamReceipt',
  Tenant = 'Tenant',
}

registerEnumType(FileKind, { name: 'FileKind' });
