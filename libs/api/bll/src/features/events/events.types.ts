import type {
  EventInsertInput,
  EventOnConflict,
  EventSetInput,
  EventBoolExp,
  EventOrderBy,
  EventSelectColumn,
  EventPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertEventArgsType = {
  objects: Array<EventInsertInput>;
  onConflict?: EventOnConflict;
};

export type InsertOneEventArgsType = {
  object: EventInsertInput;
  onConflict?: EventOnConflict;
};

export type UpdateEventArgsType = {
  where: EventBoolExp;
  _set: EventSetInput;
};

export type DeleteEventArgsType = {
  where: EventBoolExp;
};

export type UpdateByPkEventArgsType = {
  pkColumns: EventPkColumnsInput;
  _set: EventSetInput;
};

export type FindEventArgsType = {
  where: EventBoolExp;
  orderBy?: Array<EventOrderBy>;
  distinctOn?: Array<EventSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkEventArgsType = {
  id: string;
};

export type AggregateEventArgsType = {
  where: EventBoolExp;
  orderBy?: Array<EventOrderBy>;
  distinctOn?: Array<EventSelectColumn>;
  limit?: number;
  offset?: number;
};
