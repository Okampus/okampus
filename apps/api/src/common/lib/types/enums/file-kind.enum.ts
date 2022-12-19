import { registerEnumType } from '@nestjs/graphql';

export enum FileKind {
  TeamImage = 'TeamImage',
  TeamDocument = 'TeamDocument',
  TeamReceipt = 'TeamReceipt',
  TenantImage = 'TenantImage',
  UserImage = 'UserImage',
  Attachment = 'Attachment',
  Document = 'Document',
}

registerEnumType(FileKind, { name: 'FileKind' });
