import type {
  TenantInsertInput,
  TenantOnConflict,
  TenantSetInput,
  TenantBoolExp,
  TenantOrderBy,
  TenantSelectColumn,
  TenantPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTenantArgsType = {
  objects: Array<TenantInsertInput>;
  onConflict?: TenantOnConflict;
};

export type InsertOneTenantArgsType = {
  object: TenantInsertInput;
  onConflict?: TenantOnConflict;
};

export type UpdateTenantArgsType = {
  where: TenantBoolExp;
  _set: TenantSetInput;
};

export type DeleteTenantArgsType = {
  where: TenantBoolExp;
};

export type UpdateByPkTenantArgsType = {
  pkColumns: TenantPkColumnsInput;
  _set: TenantSetInput;
};

export type FindTenantArgsType = {
  where: TenantBoolExp;
  orderBy?: Array<TenantOrderBy>;
  distinctOn?: Array<TenantSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTenantArgsType = {
  id: string;
};

export type AggregateTenantArgsType = {
  where: TenantBoolExp;
  orderBy?: Array<TenantOrderBy>;
  distinctOn?: Array<TenantSelectColumn>;
  limit?: number;
  offset?: number;
};
