import { registerEnumType } from '@nestjs/graphql';

export enum ContentKind {
  Post = 'Post',
  Reply = 'Reply',
  Comment = 'Comment',
}

registerEnumType(ContentKind, { name: 'ContentKind' });
