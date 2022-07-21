import { registerEnumType } from '@nestjs/graphql';

export enum TeamEventState {
  Template = 'template',
  Draft = 'draft',
  Published = 'published',
  Approved = 'approved',
  Rejected = 'rejected',
}

registerEnumType(TeamEventState, { name: 'TeamEventState' });
