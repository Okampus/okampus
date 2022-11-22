import { registerEnumType } from '@nestjs/graphql';

export enum ContentMasterType {
  Blog = 'Blog',
  Thread = 'Thread',
}

registerEnumType(ContentMasterType, { name: 'ContentMasterType' });
