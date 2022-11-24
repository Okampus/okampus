import { registerEnumType } from '@nestjs/graphql';

export enum EventState {
  Template = 'Template',
  Draft = 'Draft',
  Submitted = 'Submitted',
  Rejected = 'Rejected',
  Published = 'Published',
}

registerEnumType(EventState, { name: 'EventState' });
