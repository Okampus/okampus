import type {
  TransactionInsertInput,
  TransactionOnConflict,
  TransactionSetInput,
  TransactionBoolExp,
  TransactionOrderBy,
  TransactionSelectColumn,
  TransactionPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTransactionArgsType = {
  objects: Array<TransactionInsertInput>;
  onConflict?: TransactionOnConflict;
};

export type InsertOneTransactionArgsType = {
  object: TransactionInsertInput;
  onConflict?: TransactionOnConflict;
};

export type UpdateTransactionArgsType = {
  where: TransactionBoolExp;
  _set: TransactionSetInput;
};

export type DeleteTransactionArgsType = {
  where: TransactionBoolExp;
};

export type DeleteByPkTransactionArgsType = {
  id: string;
};

export type UpdateByPkTransactionArgsType = {
  pkColumns: TransactionPkColumnsInput;
  _set: TransactionSetInput;
};

export type FindTransactionArgsType = {
  where: TransactionBoolExp;
  orderBy?: Array<TransactionOrderBy>;
  distinctOn?: Array<TransactionSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTransactionArgsType = {
  id: string;
};

export type AggregateTransactionArgsType = {
  where: TransactionBoolExp;
  orderBy?: Array<TransactionOrderBy>;
  distinctOn?: Array<TransactionSelectColumn>;
  limit?: number;
  offset?: number;
};
