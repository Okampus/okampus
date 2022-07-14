import { registerEnumType } from '@nestjs/graphql';

export enum ContentMasterType {
  Blog = 'blog',
  Thread = 'thread',
}

registerEnumType(ContentMasterType, { name: 'ContentMasterType' });
