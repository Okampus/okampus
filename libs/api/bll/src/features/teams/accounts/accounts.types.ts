import type {
  AccountInsertInput,
  AccountOnConflict,
  AccountSetInput,
  AccountBoolExp,
  AccountOrderBy,
  AccountSelectColumn,
  AccountPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertAccountArgsType = {
  objects: Array<AccountInsertInput>;
  onConflict?: AccountOnConflict;
};

export type InsertOneAccountArgsType = {
  object: AccountInsertInput;
  onConflict?: AccountOnConflict;
};

export type UpdateAccountArgsType = {
  where: AccountBoolExp;
  _set: AccountSetInput;
};

export type DeleteAccountArgsType = {
  where: AccountBoolExp;
};

export type DeleteByPkAccountArgsType = {
  id: string;
};

export type UpdateByPkAccountArgsType = {
  pkColumns: AccountPkColumnsInput;
  _set: AccountSetInput;
};

export type FindAccountArgsType = {
  where: AccountBoolExp;
  orderBy?: Array<AccountOrderBy>;
  distinctOn?: Array<AccountSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkAccountArgsType = {
  id: string;
};

export type AggregateAccountArgsType = {
  where: AccountBoolExp;
  orderBy?: Array<AccountOrderBy>;
  distinctOn?: Array<AccountSelectColumn>;
  limit?: number;
  offset?: number;
};
