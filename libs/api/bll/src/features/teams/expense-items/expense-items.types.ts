import type {
  ExpenseItemInsertInput,
  ExpenseItemOnConflict,
  ExpenseItemSetInput,
  ExpenseItemBoolExp,
  ExpenseItemOrderBy,
  ExpenseItemSelectColumn,
  ExpenseItemPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertExpenseItemArgsType = {
  objects: Array<ExpenseItemInsertInput>;
  onConflict?: ExpenseItemOnConflict;
};

export type InsertOneExpenseItemArgsType = {
  object: ExpenseItemInsertInput;
  onConflict?: ExpenseItemOnConflict;
};

export type UpdateExpenseItemArgsType = {
  where: ExpenseItemBoolExp;
  _set: ExpenseItemSetInput;
};

export type DeleteExpenseItemArgsType = {
  where: ExpenseItemBoolExp;
};

export type DeleteByPkExpenseItemArgsType = {
  id: string;
};

export type UpdateByPkExpenseItemArgsType = {
  pkColumns: ExpenseItemPkColumnsInput;
  _set: ExpenseItemSetInput;
};

export type FindExpenseItemArgsType = {
  where: ExpenseItemBoolExp;
  orderBy?: Array<ExpenseItemOrderBy>;
  distinctOn?: Array<ExpenseItemSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkExpenseItemArgsType = {
  id: string;
};

export type AggregateExpenseItemArgsType = {
  where: ExpenseItemBoolExp;
  orderBy?: Array<ExpenseItemOrderBy>;
  distinctOn?: Array<ExpenseItemSelectColumn>;
  limit?: number;
  offset?: number;
};
