import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertTenantArgsType = {
  objects: Array<ValueTypes['TenantInsertInput']>;
  onConflict?: ValueTypes['TenantOnConflict'];
};

export type InsertOneTenantArgsType = {
  object: ValueTypes['TenantInsertInput'];
  onConflict?: ValueTypes['TenantOnConflict'];
};

export type UpdateTenantArgsType = {
  where: ValueTypes['TenantBoolExp'];
  _set: ValueTypes['TenantSetInput'];
};

export type UpdateByPkTenantArgsType = {
  pkColumns: ValueTypes['TenantPkColumnsInput'];
  _set: ValueTypes['TenantSetInput'];
};

export type FindTenantArgsType = {
  where: ValueTypes['TenantBoolExp'];
  orderBy?: Array<ValueTypes['TenantOrderBy']>;
  distinctOn?: Array<ValueTypes['TenantSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkTenantArgsType = {
  id: string;
};

export type AggregateTenantArgsType = {
  where: ValueTypes['TenantBoolExp'];
  orderBy?: Array<ValueTypes['TenantOrderBy']>;
  distinctOn?: Array<ValueTypes['TenantSelectColumn']>;
  limit?: number;
  offset?: number;
};
