import type {
  TenantRoleInsertInput,
  TenantRoleOnConflict,
  TenantRoleSetInput,
  TenantRoleBoolExp,
  TenantRoleOrderBy,
  TenantRoleSelectColumn,
  TenantRolePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTenantRoleArgsType = {
  objects: Array<TenantRoleInsertInput>;
  onConflict?: TenantRoleOnConflict;
};

export type InsertOneTenantRoleArgsType = {
  object: TenantRoleInsertInput;
  onConflict?: TenantRoleOnConflict;
};

export type UpdateTenantRoleArgsType = {
  where: TenantRoleBoolExp;
  _set: TenantRoleSetInput;
};

export type DeleteTenantRoleArgsType = {
  where: TenantRoleBoolExp;
};

export type DeleteByPkTenantRoleArgsType = {
  id: string;
};

export type UpdateByPkTenantRoleArgsType = {
  pkColumns: TenantRolePkColumnsInput;
  _set: TenantRoleSetInput;
};

export type FindTenantRoleArgsType = {
  where: TenantRoleBoolExp;
  orderBy?: Array<TenantRoleOrderBy>;
  distinctOn?: Array<TenantRoleSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTenantRoleArgsType = {
  id: string;
};

export type AggregateTenantRoleArgsType = {
  where: TenantRoleBoolExp;
  orderBy?: Array<TenantRoleOrderBy>;
  distinctOn?: Array<TenantRoleSelectColumn>;
  limit?: number;
  offset?: number;
};
