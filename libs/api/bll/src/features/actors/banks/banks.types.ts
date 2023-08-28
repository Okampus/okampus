import type {
  BankInsertInput,
  BankOnConflict,
  BankSetInput,
  BankBoolExp,
  BankOrderBy,
  BankSelectColumn,
  BankPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertBankArgsType = {
  objects: Array<BankInsertInput>;
  onConflict?: BankOnConflict;
};

export type InsertOneBankArgsType = {
  object: BankInsertInput;
  onConflict?: BankOnConflict;
};

export type UpdateBankArgsType = {
  where: BankBoolExp;
  _set: BankSetInput;
};

export type DeleteBankArgsType = {
  where: BankBoolExp;
};

export type DeleteByPkBankArgsType = {
  id: string;
};

export type UpdateByPkBankArgsType = {
  pkColumns: BankPkColumnsInput;
  _set: BankSetInput;
};

export type FindBankArgsType = {
  where: BankBoolExp;
  orderBy?: Array<BankOrderBy>;
  distinctOn?: Array<BankSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkBankArgsType = {
  id: string;
};

export type AggregateBankArgsType = {
  where: BankBoolExp;
  orderBy?: Array<BankOrderBy>;
  distinctOn?: Array<BankSelectColumn>;
  limit?: number;
  offset?: number;
};
