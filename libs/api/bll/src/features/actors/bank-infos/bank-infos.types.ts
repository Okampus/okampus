import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertBankInfoArgsType = {
  objects: Array<ValueTypes['BankInfoInsertInput']>;
  onConflict?: ValueTypes['BankInfoOnConflict'];
};

export type InsertOneBankInfoArgsType = {
  object: ValueTypes['BankInfoInsertInput'];
  onConflict?: ValueTypes['BankInfoOnConflict'];
};

export type UpdateBankInfoArgsType = {
  where: ValueTypes['BankInfoBoolExp'];
  _set: ValueTypes['BankInfoSetInput'];
};

export type DeleteBankInfoArgsType = {
  where: ValueTypes['BankInfoBoolExp'];
};

export type UpdateByPkBankInfoArgsType = {
  pkColumns: ValueTypes['BankInfoPkColumnsInput'];
  _set: ValueTypes['BankInfoSetInput'];
};

export type FindBankInfoArgsType = {
  where: ValueTypes['BankInfoBoolExp'];
  orderBy?: Array<ValueTypes['BankInfoOrderBy']>;
  distinctOn?: Array<ValueTypes['BankInfoSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkBankInfoArgsType = {
  id: string;
};

export type AggregateBankInfoArgsType = {
  where: ValueTypes['BankInfoBoolExp'];
  orderBy?: Array<ValueTypes['BankInfoOrderBy']>;
  distinctOn?: Array<ValueTypes['BankInfoSelectColumn']>;
  limit?: number;
  offset?: number;
};
