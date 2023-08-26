import type {
  EventJoinInsertInput,
  EventJoinOnConflict,
  EventJoinSetInput,
  EventJoinBoolExp,
  EventJoinOrderBy,
  EventJoinSelectColumn,
  EventJoinPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertEventJoinArgsType = {
  objects: Array<EventJoinInsertInput>;
  onConflict?: EventJoinOnConflict;
};

export type InsertOneEventJoinArgsType = {
  object: EventJoinInsertInput;
  onConflict?: EventJoinOnConflict;
};

export type UpdateEventJoinArgsType = {
  where: EventJoinBoolExp;
  _set: EventJoinSetInput;
};

export type DeleteEventJoinArgsType = {
  where: EventJoinBoolExp;
};

export type DeleteByPkEventJoinArgsType = {
  id: string;
};

export type UpdateByPkEventJoinArgsType = {
  pkColumns: EventJoinPkColumnsInput;
  _set: EventJoinSetInput;
};

export type FindEventJoinArgsType = {
  where: EventJoinBoolExp;
  orderBy?: Array<EventJoinOrderBy>;
  distinctOn?: Array<EventJoinSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkEventJoinArgsType = {
  id: string;
};

export type AggregateEventJoinArgsType = {
  where: EventJoinBoolExp;
  orderBy?: Array<EventJoinOrderBy>;
  distinctOn?: Array<EventJoinSelectColumn>;
  limit?: number;
  offset?: number;
};
