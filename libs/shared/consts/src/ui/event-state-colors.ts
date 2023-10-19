import { EventState } from '@prisma/client';

export const EVENT_STATE_COLORS = {
  [EventState.Template]: '#000000dd',
  [EventState.Draft]: '#aaaaaadd',
  [EventState.Submitted]: '#daaa0f',
  [EventState.Rejected]: '#ff4d4f',
  [EventState.Approved]: '#52c41a',
  [EventState.Published]: '#1890ff',
  [EventState.Canceled]: '#ff4d4f',
};
