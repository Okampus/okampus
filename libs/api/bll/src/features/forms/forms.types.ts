import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertFormArgsType = {
  objects: Array<ValueTypes['FormInsertInput']>;
  onConflict?: ValueTypes['FormOnConflict'];
};

export type InsertOneFormArgsType = {
  object: ValueTypes['FormInsertInput'];
  onConflict?: ValueTypes['FormOnConflict'];
};

export type UpdateFormArgsType = {
  where: ValueTypes['FormBoolExp'];
  _set: ValueTypes['FormSetInput'];
};

export type UpdateByPkFormArgsType = {
  pkColumns: ValueTypes['FormPkColumnsInput'];
  _set: ValueTypes['FormSetInput'];
};

export type FindFormArgsType = {
  where: ValueTypes['FormBoolExp'];
  orderBy?: Array<ValueTypes['FormOrderBy']>;
  distinctOn?: Array<ValueTypes['FormSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkFormArgsType = {
  id: string;
};

export type AggregateFormArgsType = {
  where: ValueTypes['FormBoolExp'];
  orderBy?: Array<ValueTypes['FormOrderBy']>;
  distinctOn?: Array<ValueTypes['FormSelectColumn']>;
  limit?: number;
  offset?: number;
};
