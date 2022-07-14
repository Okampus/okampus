import { registerEnumType } from '@nestjs/graphql';

export enum ContentKind {
  Post,
  Reply,
  Comment,
}

registerEnumType(ContentKind, { name: 'ContentKind' });
