import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertFollowArgsType = {
  objects: Array<ValueTypes['FollowInsertInput']>;
  onConflict?: ValueTypes['FollowOnConflict'];
};

export type InsertOneFollowArgsType = {
  object: ValueTypes['FollowInsertInput'];
  onConflict?: ValueTypes['FollowOnConflict'];
};

export type UpdateFollowArgsType = {
  where: ValueTypes['FollowBoolExp'];
  _set: ValueTypes['FollowSetInput'];
};

export type DeleteFollowArgsType = {
  where: ValueTypes['FollowBoolExp'];
};

export type UpdateByPkFollowArgsType = {
  pkColumns: ValueTypes['FollowPkColumnsInput'];
  _set: ValueTypes['FollowSetInput'];
};

export type FindFollowArgsType = {
  where: ValueTypes['FollowBoolExp'];
  orderBy?: Array<ValueTypes['FollowOrderBy']>;
  distinctOn?: Array<ValueTypes['FollowSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkFollowArgsType = {
  id: string;
};

export type AggregateFollowArgsType = {
  where: ValueTypes['FollowBoolExp'];
  orderBy?: Array<ValueTypes['FollowOrderBy']>;
  distinctOn?: Array<ValueTypes['FollowSelectColumn']>;
  limit?: number;
  offset?: number;
};
