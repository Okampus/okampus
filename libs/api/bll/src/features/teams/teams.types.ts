import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertTeamArgsType = {
  objects: Array<ValueTypes['TeamInsertInput']>;
  onConflict?: ValueTypes['TeamOnConflict'];
};

export type InsertOneTeamArgsType = {
  object: ValueTypes['TeamInsertInput'];
  onConflict?: ValueTypes['TeamOnConflict'];
};

export type UpdateTeamArgsType = {
  where: ValueTypes['TeamBoolExp'];
  _set: ValueTypes['TeamSetInput'];
};

export type DeleteTeamArgsType = {
  where: ValueTypes['TeamBoolExp'];
};

export type UpdateByPkTeamArgsType = {
  pkColumns: ValueTypes['TeamPkColumnsInput'];
  _set: ValueTypes['TeamSetInput'];
};

export type FindTeamArgsType = {
  where: ValueTypes['TeamBoolExp'];
  orderBy?: Array<ValueTypes['TeamOrderBy']>;
  distinctOn?: Array<ValueTypes['TeamSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkTeamArgsType = {
  id: string;
};

export type AggregateTeamArgsType = {
  where: ValueTypes['TeamBoolExp'];
  orderBy?: Array<ValueTypes['TeamOrderBy']>;
  distinctOn?: Array<ValueTypes['TeamSelectColumn']>;
  limit?: number;
  offset?: number;
};
