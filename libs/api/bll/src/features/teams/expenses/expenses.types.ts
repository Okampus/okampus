import type {
  ExpenseInsertInput,
  ExpenseOnConflict,
  ExpenseSetInput,
  ExpenseBoolExp,
  ExpenseOrderBy,
  ExpenseSelectColumn,
  ExpensePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertExpenseArgsType = {
  objects: Array<ExpenseInsertInput>;
  onConflict?: ExpenseOnConflict;
};

export type InsertOneExpenseArgsType = {
  object: ExpenseInsertInput;
  onConflict?: ExpenseOnConflict;
};

export type UpdateExpenseArgsType = {
  where: ExpenseBoolExp;
  _set: ExpenseSetInput;
};

export type DeleteExpenseArgsType = {
  where: ExpenseBoolExp;
};

export type DeleteByPkExpenseArgsType = {
  id: string;
};

export type UpdateByPkExpenseArgsType = {
  pkColumns: ExpensePkColumnsInput;
  _set: ExpenseSetInput;
};

export type FindExpenseArgsType = {
  where: ExpenseBoolExp;
  orderBy?: Array<ExpenseOrderBy>;
  distinctOn?: Array<ExpenseSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkExpenseArgsType = {
  id: string;
};

export type AggregateExpenseArgsType = {
  where: ExpenseBoolExp;
  orderBy?: Array<ExpenseOrderBy>;
  distinctOn?: Array<ExpenseSelectColumn>;
  limit?: number;
  offset?: number;
};
