import { registerEnumType } from '@nestjs/graphql';

export enum AnnouncementState {
  Draft = 'Draft',
  Committed = 'Committed',
  Hidden = 'Hidden',
}

registerEnumType(AnnouncementState, { name: 'AnnouncementState' });
