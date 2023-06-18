import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertActionArgsType = {
  objects: Array<ValueTypes['ActionInsertInput']>;
  onConflict?: ValueTypes['ActionOnConflict'];
};

export type InsertOneActionArgsType = {
  object: ValueTypes['ActionInsertInput'];
  onConflict?: ValueTypes['ActionOnConflict'];
};

export type UpdateActionArgsType = {
  where: ValueTypes['ActionBoolExp'];
  _set: ValueTypes['ActionSetInput'];
};

export type DeleteActionArgsType = {
  where: ValueTypes['ActionBoolExp'];
};

export type UpdateByPkActionArgsType = {
  pkColumns: ValueTypes['ActionPkColumnsInput'];
  _set: ValueTypes['ActionSetInput'];
};

export type FindActionArgsType = {
  where: ValueTypes['ActionBoolExp'];
  orderBy?: Array<ValueTypes['ActionOrderBy']>;
  distinctOn?: Array<ValueTypes['ActionSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkActionArgsType = {
  id: string;
};

export type AggregateActionArgsType = {
  where: ValueTypes['ActionBoolExp'];
  orderBy?: Array<ValueTypes['ActionOrderBy']>;
  distinctOn?: Array<ValueTypes['ActionSelectColumn']>;
  limit?: number;
  offset?: number;
};
