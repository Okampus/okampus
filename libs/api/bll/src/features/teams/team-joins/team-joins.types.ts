import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertTeamJoinArgsType = {
  objects: Array<ValueTypes['TeamJoinInsertInput']>;
  onConflict?: ValueTypes['TeamJoinOnConflict'];
};

export type InsertOneTeamJoinArgsType = {
  object: ValueTypes['TeamJoinInsertInput'];
  onConflict?: ValueTypes['TeamJoinOnConflict'];
};

export type UpdateTeamJoinArgsType = {
  where: ValueTypes['TeamJoinBoolExp'];
  _set: ValueTypes['TeamJoinSetInput'];
};

export type DeleteTeamJoinArgsType = {
  where: ValueTypes['TeamJoinBoolExp'];
};

export type UpdateByPkTeamJoinArgsType = {
  pkColumns: ValueTypes['TeamJoinPkColumnsInput'];
  _set: ValueTypes['TeamJoinSetInput'];
};

export type FindTeamJoinArgsType = {
  where: ValueTypes['TeamJoinBoolExp'];
  orderBy?: Array<ValueTypes['TeamJoinOrderBy']>;
  distinctOn?: Array<ValueTypes['TeamJoinSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkTeamJoinArgsType = {
  id: string;
};

export type AggregateTeamJoinArgsType = {
  where: ValueTypes['TeamJoinBoolExp'];
  orderBy?: Array<ValueTypes['TeamJoinOrderBy']>;
  distinctOn?: Array<ValueTypes['TeamJoinSelectColumn']>;
  limit?: number;
  offset?: number;
};
