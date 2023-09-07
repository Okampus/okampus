import type {
  BankInfoInsertInput,
  BankInfoOnConflict,
  BankInfoSetInput,
  BankInfoBoolExp,
  BankInfoOrderBy,
  BankInfoSelectColumn,
  BankInfoPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertBankInfoArgsType = {
  objects: Array<BankInfoInsertInput>;
  onConflict?: BankInfoOnConflict;
};

export type InsertOneBankInfoArgsType = {
  object: BankInfoInsertInput;
  onConflict?: BankInfoOnConflict;
};

export type UpdateBankInfoArgsType = {
  where: BankInfoBoolExp;
  _set: BankInfoSetInput;
};

export type DeleteBankInfoArgsType = {
  where: BankInfoBoolExp;
};

export type DeleteByPkBankInfoArgsType = {
  id: string;
};

export type UpdateByPkBankInfoArgsType = {
  pkColumns: BankInfoPkColumnsInput;
  _set: BankInfoSetInput;
};

export type FindBankInfoArgsType = {
  where: BankInfoBoolExp;
  orderBy?: Array<BankInfoOrderBy>;
  distinctOn?: Array<BankInfoSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkBankInfoArgsType = {
  id: string;
};

export type AggregateBankInfoArgsType = {
  where: BankInfoBoolExp;
  orderBy?: Array<BankInfoOrderBy>;
  distinctOn?: Array<BankInfoSelectColumn>;
  limit?: number;
  offset?: number;
};
