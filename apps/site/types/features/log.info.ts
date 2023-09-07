import type { UserMinimalInfo } from './user.info';

export type LogMinimalInfo = {
  id: string;
  createdAt: string;
  createdBy?: UserMinimalInfo | null;
  diff: unknown;
  note: string;
  entityName: string;
  eventType: string;
  entityId: string;
  context: string;
};
