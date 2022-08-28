import { registerEnumType } from '@nestjs/graphql';

export enum ThreadType {
  Question = 'Question',
  Suggestion = 'Suggestion',
  Problem = 'Problem',
  Discussion = 'Discussion',
  Other = 'Other',
}

registerEnumType(ThreadType, { name: 'ThreadType' });
