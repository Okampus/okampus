import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertUserInfoArgsType = {
  objects: Array<ValueTypes['UserInfoInsertInput']>;
  onConflict?: ValueTypes['UserInfoOnConflict'];
};

export type InsertOneUserInfoArgsType = {
  object: ValueTypes['UserInfoInsertInput'];
  onConflict?: ValueTypes['UserInfoOnConflict'];
};

export type UpdateUserInfoArgsType = {
  where: ValueTypes['UserInfoBoolExp'];
  _set: ValueTypes['UserInfoSetInput'];
};

export type DeleteUserInfoArgsType = {
  where: ValueTypes['UserInfoBoolExp'];
};

export type UpdateByPkUserInfoArgsType = {
  pkColumns: ValueTypes['UserInfoPkColumnsInput'];
  _set: ValueTypes['UserInfoSetInput'];
};

export type FindUserInfoArgsType = {
  where: ValueTypes['UserInfoBoolExp'];
  orderBy?: Array<ValueTypes['UserInfoOrderBy']>;
  distinctOn?: Array<ValueTypes['UserInfoSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkUserInfoArgsType = {
  id: string;
};

export type AggregateUserInfoArgsType = {
  where: ValueTypes['UserInfoBoolExp'];
  orderBy?: Array<ValueTypes['UserInfoOrderBy']>;
  distinctOn?: Array<ValueTypes['UserInfoSelectColumn']>;
  limit?: number;
  offset?: number;
};
