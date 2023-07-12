import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertIndividualArgsType = {
  objects: Array<ValueTypes['IndividualInsertInput']>;
  onConflict?: ValueTypes['IndividualOnConflict'];
};

export type InsertOneIndividualArgsType = {
  object: ValueTypes['IndividualInsertInput'];
  onConflict?: ValueTypes['IndividualOnConflict'];
};

export type UpdateIndividualArgsType = {
  where: ValueTypes['IndividualBoolExp'];
  _set: ValueTypes['IndividualSetInput'];
};

export type DeleteIndividualArgsType = {
  where: ValueTypes['IndividualBoolExp'];
};

export type UpdateByPkIndividualArgsType = {
  pkColumns: ValueTypes['IndividualPkColumnsInput'];
  _set: ValueTypes['IndividualSetInput'];
};

export type FindIndividualArgsType = {
  where: ValueTypes['IndividualBoolExp'];
  orderBy?: Array<ValueTypes['IndividualOrderBy']>;
  distinctOn?: Array<ValueTypes['IndividualSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkIndividualArgsType = {
  id: string;
};

export type AggregateIndividualArgsType = {
  where: ValueTypes['IndividualBoolExp'];
  orderBy?: Array<ValueTypes['IndividualOrderBy']>;
  distinctOn?: Array<ValueTypes['IndividualSelectColumn']>;
  limit?: number;
  offset?: number;
};
