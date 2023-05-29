import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertEventJoinArgsType = {
  objects: Array<ValueTypes['EventJoinInsertInput']>;
  onConflict?: ValueTypes['EventJoinOnConflict'];
};

export type InsertOneEventJoinArgsType = {
  object: ValueTypes['EventJoinInsertInput'];
  onConflict?: ValueTypes['EventJoinOnConflict'];
};

export type UpdateEventJoinArgsType = {
  where: ValueTypes['EventJoinBoolExp'];
  _set: ValueTypes['EventJoinSetInput'];
};

export type UpdateByPkEventJoinArgsType = {
  pkColumns: ValueTypes['EventJoinPkColumnsInput'];
  _set: ValueTypes['EventJoinSetInput'];
};

export type FindEventJoinArgsType = {
  where: ValueTypes['EventJoinBoolExp'];
  orderBy?: Array<ValueTypes['EventJoinOrderBy']>;
  distinctOn?: Array<ValueTypes['EventJoinSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkEventJoinArgsType = {
  id: string;
};

export type AggregateEventJoinArgsType = {
  where: ValueTypes['EventJoinBoolExp'];
  orderBy?: Array<ValueTypes['EventJoinOrderBy']>;
  distinctOn?: Array<ValueTypes['EventJoinSelectColumn']>;
  limit?: number;
  offset?: number;
};
