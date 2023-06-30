import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertAccountArgsType = {
  objects: Array<ValueTypes['AccountInsertInput']>;
  onConflict?: ValueTypes['AccountOnConflict'];
};

export type InsertOneAccountArgsType = {
  object: ValueTypes['AccountInsertInput'];
  onConflict?: ValueTypes['AccountOnConflict'];
};

export type UpdateAccountArgsType = {
  where: ValueTypes['AccountBoolExp'];
  _set: ValueTypes['AccountSetInput'];
};

export type DeleteAccountArgsType = {
  where: ValueTypes['AccountBoolExp'];
};

export type UpdateByPkAccountArgsType = {
  pkColumns: ValueTypes['AccountPkColumnsInput'];
  _set: ValueTypes['AccountSetInput'];
};

export type FindAccountArgsType = {
  where: ValueTypes['AccountBoolExp'];
  orderBy?: Array<ValueTypes['AccountOrderBy']>;
  distinctOn?: Array<ValueTypes['AccountSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkAccountArgsType = {
  id: string;
};

export type AggregateAccountArgsType = {
  where: ValueTypes['AccountBoolExp'];
  orderBy?: Array<ValueTypes['AccountOrderBy']>;
  distinctOn?: Array<ValueTypes['AccountSelectColumn']>;
  limit?: number;
  offset?: number;
};
