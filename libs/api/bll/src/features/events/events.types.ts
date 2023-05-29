import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertEventArgsType = {
  objects: Array<ValueTypes['EventInsertInput']>;
  onConflict?: ValueTypes['EventOnConflict'];
};

export type InsertOneEventArgsType = {
  object: ValueTypes['EventInsertInput'];
  onConflict?: ValueTypes['EventOnConflict'];
};

export type UpdateEventArgsType = {
  where: ValueTypes['EventBoolExp'];
  _set: ValueTypes['EventSetInput'];
};

export type UpdateByPkEventArgsType = {
  pkColumns: ValueTypes['EventPkColumnsInput'];
  _set: ValueTypes['EventSetInput'];
};

export type FindEventArgsType = {
  where: ValueTypes['EventBoolExp'];
  orderBy?: Array<ValueTypes['EventOrderBy']>;
  distinctOn?: Array<ValueTypes['EventSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkEventArgsType = {
  id: string;
};

export type AggregateEventArgsType = {
  where: ValueTypes['EventBoolExp'];
  orderBy?: Array<ValueTypes['EventOrderBy']>;
  distinctOn?: Array<ValueTypes['EventSelectColumn']>;
  limit?: number;
  offset?: number;
};
