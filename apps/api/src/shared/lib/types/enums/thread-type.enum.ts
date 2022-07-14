import { registerEnumType } from '@nestjs/graphql';

export enum ThreadType {
  Question,
  Suggestion,
  Problem,
  Discussion,
  Other,
}

registerEnumType(ThreadType, { name: 'ThreadType' });
