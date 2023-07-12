import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertFinanceArgsType = {
  objects: Array<ValueTypes['FinanceInsertInput']>;
  onConflict?: ValueTypes['FinanceOnConflict'];
};

export type InsertOneFinanceArgsType = {
  object: ValueTypes['FinanceInsertInput'];
  onConflict?: ValueTypes['FinanceOnConflict'];
};

export type UpdateFinanceArgsType = {
  where: ValueTypes['FinanceBoolExp'];
  _set: ValueTypes['FinanceSetInput'];
};

export type DeleteFinanceArgsType = {
  where: ValueTypes['FinanceBoolExp'];
};

export type UpdateByPkFinanceArgsType = {
  pkColumns: ValueTypes['FinancePkColumnsInput'];
  _set: ValueTypes['FinanceSetInput'];
};

export type FindFinanceArgsType = {
  where: ValueTypes['FinanceBoolExp'];
  orderBy?: Array<ValueTypes['FinanceOrderBy']>;
  distinctOn?: Array<ValueTypes['FinanceSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkFinanceArgsType = {
  id: string;
};

export type AggregateFinanceArgsType = {
  where: ValueTypes['FinanceBoolExp'];
  orderBy?: Array<ValueTypes['FinanceOrderBy']>;
  distinctOn?: Array<ValueTypes['FinanceSelectColumn']>;
  limit?: number;
  offset?: number;
};
