import type {
  BankAccountInsertInput,
  BankAccountOnConflict,
  BankAccountSetInput,
  BankAccountBoolExp,
  BankAccountOrderBy,
  BankAccountSelectColumn,
  BankAccountPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertBankAccountArgsType = {
  objects: Array<BankAccountInsertInput>;
  onConflict?: BankAccountOnConflict;
};

export type InsertOneBankAccountArgsType = {
  object: BankAccountInsertInput;
  onConflict?: BankAccountOnConflict;
};

export type UpdateBankAccountArgsType = {
  where: BankAccountBoolExp;
  _set: BankAccountSetInput;
};

export type DeleteBankAccountArgsType = {
  where: BankAccountBoolExp;
};

export type DeleteByPkBankAccountArgsType = {
  id: string;
};

export type UpdateByPkBankAccountArgsType = {
  pkColumns: BankAccountPkColumnsInput;
  _set: BankAccountSetInput;
};

export type FindBankAccountArgsType = {
  where: BankAccountBoolExp;
  orderBy?: Array<BankAccountOrderBy>;
  distinctOn?: Array<BankAccountSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkBankAccountArgsType = {
  id: string;
};

export type AggregateBankAccountArgsType = {
  where: BankAccountBoolExp;
  orderBy?: Array<BankAccountOrderBy>;
  distinctOn?: Array<BankAccountSelectColumn>;
  limit?: number;
  offset?: number;
};
