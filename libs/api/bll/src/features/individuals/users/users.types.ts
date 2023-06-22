import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertUserArgsType = {
  objects: Array<ValueTypes['UserInsertInput']>;
  onConflict?: ValueTypes['UserOnConflict'];
};

export type InsertOneUserArgsType = {
  object: ValueTypes['UserInsertInput'];
  onConflict?: ValueTypes['UserOnConflict'];
};

export type UpdateUserArgsType = {
  where: ValueTypes['UserBoolExp'];
  _set: ValueTypes['UserSetInput'];
};

export type DeleteUserArgsType = {
  where: ValueTypes['UserBoolExp'];
};

export type UpdateByPkUserArgsType = {
  pkColumns: ValueTypes['UserPkColumnsInput'];
  _set: ValueTypes['UserSetInput'];
};

export type FindUserArgsType = {
  where: ValueTypes['UserBoolExp'];
  orderBy?: Array<ValueTypes['UserOrderBy']>;
  distinctOn?: Array<ValueTypes['UserSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkUserArgsType = {
  id: string;
};

export type AggregateUserArgsType = {
  where: ValueTypes['UserBoolExp'];
  orderBy?: Array<ValueTypes['UserOrderBy']>;
  distinctOn?: Array<ValueTypes['UserSelectColumn']>;
  limit?: number;
  offset?: number;
};
