import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertTeamFinanceArgsType = {
  objects: Array<ValueTypes['TeamFinanceInsertInput']>;
  onConflict?: ValueTypes['TeamFinanceOnConflict'];
};

export type InsertOneTeamFinanceArgsType = {
  object: ValueTypes['TeamFinanceInsertInput'];
  onConflict?: ValueTypes['TeamFinanceOnConflict'];
};

export type UpdateTeamFinanceArgsType = {
  where: ValueTypes['TeamFinanceBoolExp'];
  _set: ValueTypes['TeamFinanceSetInput'];
};

export type DeleteTeamFinanceArgsType = {
  where: ValueTypes['TeamFinanceBoolExp'];
};

export type UpdateByPkTeamFinanceArgsType = {
  pkColumns: ValueTypes['TeamFinancePkColumnsInput'];
  _set: ValueTypes['TeamFinanceSetInput'];
};

export type FindTeamFinanceArgsType = {
  where: ValueTypes['TeamFinanceBoolExp'];
  orderBy?: Array<ValueTypes['TeamFinanceOrderBy']>;
  distinctOn?: Array<ValueTypes['TeamFinanceSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkTeamFinanceArgsType = {
  id: string;
};

export type AggregateTeamFinanceArgsType = {
  where: ValueTypes['TeamFinanceBoolExp'];
  orderBy?: Array<ValueTypes['TeamFinanceOrderBy']>;
  distinctOn?: Array<ValueTypes['TeamFinanceSelectColumn']>;
  limit?: number;
  offset?: number;
};
