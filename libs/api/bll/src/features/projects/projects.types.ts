import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertProjectArgsType = {
  objects: Array<ValueTypes['ProjectInsertInput']>;
  onConflict?: ValueTypes['ProjectOnConflict'];
};

export type InsertOneProjectArgsType = {
  object: ValueTypes['ProjectInsertInput'];
  onConflict?: ValueTypes['ProjectOnConflict'];
};

export type UpdateProjectArgsType = {
  where: ValueTypes['ProjectBoolExp'];
  _set: ValueTypes['ProjectSetInput'];
};

export type DeleteProjectArgsType = {
  where: ValueTypes['ProjectBoolExp'];
};

export type UpdateByPkProjectArgsType = {
  pkColumns: ValueTypes['ProjectPkColumnsInput'];
  _set: ValueTypes['ProjectSetInput'];
};

export type FindProjectArgsType = {
  where: ValueTypes['ProjectBoolExp'];
  orderBy?: Array<ValueTypes['ProjectOrderBy']>;
  distinctOn?: Array<ValueTypes['ProjectSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkProjectArgsType = {
  id: string;
};

export type AggregateProjectArgsType = {
  where: ValueTypes['ProjectBoolExp'];
  orderBy?: Array<ValueTypes['ProjectOrderBy']>;
  distinctOn?: Array<ValueTypes['ProjectSelectColumn']>;
  limit?: number;
  offset?: number;
};
