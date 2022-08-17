import { registerEnumType } from '@nestjs/graphql';

export enum FileKind {
  ProfileImage = 'profile-image',
  InfoDoc = 'info-doc',
  Attachment = 'attachment',
  StudyDoc = 'study-doc',
  TeamFile = 'team-file',
  TeamGallery = 'team-gallery',
  TeamReceipt = 'team-receipt',
  Tenant = 'tenant',
}

registerEnumType(FileKind, { name: 'FileKind' });
