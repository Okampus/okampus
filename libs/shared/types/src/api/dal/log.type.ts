import type { ActorImageType, EntityName, EventType } from '@okampus/shared/enums';
import type { JSON } from '../../types/json.type';

export enum DiffType {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Json = 'Json',
  Rel = 'Rel',
}

export type Diff = {
  before: JSON;
  after: JSON;
  type: DiffType;
};

export type LogDiff = {
  [key: string]: Diff;
};

export type ILog = {
  id: string;
  createdAt: Date;
  createdBy: {
    individual: {
      id: string;
      actor: {
        id: string;
        name: string;
        actorImages: {
          id: string;
          type: ActorImageType;
          image: {
            id: string;
            url: string;
          };
        };
      };
    };
  };
  eventType: EventType;
  context: string;
  diff: LogDiff;
  entityName: EntityName;
  entityId: string;
  note: string;
};
