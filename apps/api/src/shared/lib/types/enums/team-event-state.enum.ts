import { registerEnumType } from '@nestjs/graphql';

export enum TeamEventState {
  Template = 'template',
  Draft = 'draft',
  Submitted = 'submitted',
  Rejected = 'rejected',
  Published = 'published',
}

registerEnumType(TeamEventState, { name: 'TeamEventState' });
