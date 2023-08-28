import type {
  FollowInsertInput,
  FollowOnConflict,
  FollowSetInput,
  FollowBoolExp,
  FollowOrderBy,
  FollowSelectColumn,
  FollowPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertFollowArgsType = {
  objects: Array<FollowInsertInput>;
  onConflict?: FollowOnConflict;
};

export type InsertOneFollowArgsType = {
  object: FollowInsertInput;
  onConflict?: FollowOnConflict;
};

export type UpdateFollowArgsType = {
  where: FollowBoolExp;
  _set: FollowSetInput;
};

export type DeleteFollowArgsType = {
  where: FollowBoolExp;
};

export type DeleteByPkFollowArgsType = {
  id: string;
};

export type UpdateByPkFollowArgsType = {
  pkColumns: FollowPkColumnsInput;
  _set: FollowSetInput;
};

export type FindFollowArgsType = {
  where: FollowBoolExp;
  orderBy?: Array<FollowOrderBy>;
  distinctOn?: Array<FollowSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkFollowArgsType = {
  id: string;
};

export type AggregateFollowArgsType = {
  where: FollowBoolExp;
  orderBy?: Array<FollowOrderBy>;
  distinctOn?: Array<FollowSelectColumn>;
  limit?: number;
  offset?: number;
};
