import { registerEnumType } from '@nestjs/graphql';

export enum TeamEventState {
  Template = 'Template',
  Draft = 'Draft',
  Submitted = 'Submitted',
  Rejected = 'Rejected',
  Published = 'Published',
}

registerEnumType(TeamEventState, { name: 'TeamEventState' });
