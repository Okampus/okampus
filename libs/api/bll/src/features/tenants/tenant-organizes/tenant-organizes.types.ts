import type {
  TenantOrganizeInsertInput,
  TenantOrganizeOnConflict,
  TenantOrganizeSetInput,
  TenantOrganizeBoolExp,
  TenantOrganizeOrderBy,
  TenantOrganizeSelectColumn,
  TenantOrganizePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTenantOrganizeArgsType = {
  objects: Array<TenantOrganizeInsertInput>;
  onConflict?: TenantOrganizeOnConflict;
};

export type InsertOneTenantOrganizeArgsType = {
  object: TenantOrganizeInsertInput;
  onConflict?: TenantOrganizeOnConflict;
};

export type UpdateTenantOrganizeArgsType = {
  where: TenantOrganizeBoolExp;
  _set: TenantOrganizeSetInput;
};

export type DeleteTenantOrganizeArgsType = {
  where: TenantOrganizeBoolExp;
};

export type DeleteByPkTenantOrganizeArgsType = {
  id: string;
};

export type UpdateByPkTenantOrganizeArgsType = {
  pkColumns: TenantOrganizePkColumnsInput;
  _set: TenantOrganizeSetInput;
};

export type FindTenantOrganizeArgsType = {
  where: TenantOrganizeBoolExp;
  orderBy?: Array<TenantOrganizeOrderBy>;
  distinctOn?: Array<TenantOrganizeSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTenantOrganizeArgsType = {
  id: string;
};

export type AggregateTenantOrganizeArgsType = {
  where: TenantOrganizeBoolExp;
  orderBy?: Array<TenantOrganizeOrderBy>;
  distinctOn?: Array<TenantOrganizeSelectColumn>;
  limit?: number;
  offset?: number;
};
