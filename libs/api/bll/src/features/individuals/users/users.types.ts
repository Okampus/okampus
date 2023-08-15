import type {
  UserInsertInput,
  UserOnConflict,
  UserSetInput,
  UserBoolExp,
  UserOrderBy,
  UserSelectColumn,
  UserPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertUserArgsType = {
  objects: Array<UserInsertInput>;
  onConflict?: UserOnConflict;
};

export type InsertOneUserArgsType = {
  object: UserInsertInput;
  onConflict?: UserOnConflict;
};

export type UpdateUserArgsType = {
  where: UserBoolExp;
  _set: UserSetInput;
};

export type DeleteUserArgsType = {
  where: UserBoolExp;
};

export type UpdateByPkUserArgsType = {
  pkColumns: UserPkColumnsInput;
  _set: UserSetInput;
};

export type FindUserArgsType = {
  where: UserBoolExp;
  orderBy?: Array<UserOrderBy>;
  distinctOn?: Array<UserSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkUserArgsType = {
  id: string;
};

export type AggregateUserArgsType = {
  where: UserBoolExp;
  orderBy?: Array<UserOrderBy>;
  distinctOn?: Array<UserSelectColumn>;
  limit?: number;
  offset?: number;
};
