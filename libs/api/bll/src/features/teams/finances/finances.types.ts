import type {
  FinanceInsertInput,
  FinanceOnConflict,
  FinanceSetInput,
  FinanceBoolExp,
  FinanceOrderBy,
  FinanceSelectColumn,
  FinancePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertFinanceArgsType = {
  objects: Array<FinanceInsertInput>;
  onConflict?: FinanceOnConflict;
};

export type InsertOneFinanceArgsType = {
  object: FinanceInsertInput;
  onConflict?: FinanceOnConflict;
};

export type UpdateFinanceArgsType = {
  where: FinanceBoolExp;
  _set: FinanceSetInput;
};

export type DeleteFinanceArgsType = {
  where: FinanceBoolExp;
};

export type UpdateByPkFinanceArgsType = {
  pkColumns: FinancePkColumnsInput;
  _set: FinanceSetInput;
};

export type FindFinanceArgsType = {
  where: FinanceBoolExp;
  orderBy?: Array<FinanceOrderBy>;
  distinctOn?: Array<FinanceSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkFinanceArgsType = {
  id: string;
};

export type AggregateFinanceArgsType = {
  where: FinanceBoolExp;
  orderBy?: Array<FinanceOrderBy>;
  distinctOn?: Array<FinanceSelectColumn>;
  limit?: number;
  offset?: number;
};
