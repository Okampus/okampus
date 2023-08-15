import type { IndividualMinimalInfo } from './individual.info';

export type LogMinimalInfo = {
  id: string;
  createdAt: string;
  createdBy?: IndividualMinimalInfo | null;
  diff: unknown;
  note: string;
  entityName: string;
  eventType: string;
  entityId: string;
  context: string;
};
