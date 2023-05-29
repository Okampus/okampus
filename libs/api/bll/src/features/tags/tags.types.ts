import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertTagArgsType = {
  objects: Array<ValueTypes['TagInsertInput']>;
  onConflict?: ValueTypes['TagOnConflict'];
};

export type InsertOneTagArgsType = {
  object: ValueTypes['TagInsertInput'];
  onConflict?: ValueTypes['TagOnConflict'];
};

export type UpdateTagArgsType = {
  where: ValueTypes['TagBoolExp'];
  _set: ValueTypes['TagSetInput'];
};

export type UpdateByPkTagArgsType = {
  pkColumns: ValueTypes['TagPkColumnsInput'];
  _set: ValueTypes['TagSetInput'];
};

export type FindTagArgsType = {
  where: ValueTypes['TagBoolExp'];
  orderBy?: Array<ValueTypes['TagOrderBy']>;
  distinctOn?: Array<ValueTypes['TagSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkTagArgsType = {
  id: string;
};

export type AggregateTagArgsType = {
  where: ValueTypes['TagBoolExp'];
  orderBy?: Array<ValueTypes['TagOrderBy']>;
  distinctOn?: Array<ValueTypes['TagSelectColumn']>;
  limit?: number;
  offset?: number;
};
