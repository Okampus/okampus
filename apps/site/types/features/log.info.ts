import type { UserMinimalInfo } from './user.info';

export type LogMinimalInfo = {
  id: bigint | string;
  context: string;
  createdAt: Date;
  createdBy?: UserMinimalInfo | null;
  diff: unknown;
  entityName: string;
  entityId: bigint | string;
  note: string;
  type: string;
};
