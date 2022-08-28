import { registerEnumType } from '@nestjs/graphql';

export enum Statistic {
  Comment = 'Comment',
  Post = 'Post',
  Reply = 'Reply',
  Upload = 'Upload',
}

registerEnumType(Statistic, { name: 'Statistic' });
