import { registerEnumType } from '@nestjs/graphql';

export enum TeamFileType {
  Document = 'document',
  Gallery = 'gallery',
  Receipt = 'receipt',
}

registerEnumType(TeamFileType, { name: 'TeamFileType' });
