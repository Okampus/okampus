import type {
  TenantMemberRoleInsertInput,
  TenantMemberRoleOnConflict,
  TenantMemberRoleSetInput,
  TenantMemberRoleBoolExp,
  TenantMemberRoleOrderBy,
  TenantMemberRoleSelectColumn,
  TenantMemberRolePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTenantMemberRoleArgsType = {
  objects: Array<TenantMemberRoleInsertInput>;
  onConflict?: TenantMemberRoleOnConflict;
};

export type InsertOneTenantMemberRoleArgsType = {
  object: TenantMemberRoleInsertInput;
  onConflict?: TenantMemberRoleOnConflict;
};

export type UpdateTenantMemberRoleArgsType = {
  where: TenantMemberRoleBoolExp;
  _set: TenantMemberRoleSetInput;
};

export type DeleteTenantMemberRoleArgsType = {
  where: TenantMemberRoleBoolExp;
};

export type DeleteByPkTenantMemberRoleArgsType = {
  id: string;
};

export type UpdateByPkTenantMemberRoleArgsType = {
  pkColumns: TenantMemberRolePkColumnsInput;
  _set: TenantMemberRoleSetInput;
};

export type FindTenantMemberRoleArgsType = {
  where: TenantMemberRoleBoolExp;
  orderBy?: Array<TenantMemberRoleOrderBy>;
  distinctOn?: Array<TenantMemberRoleSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTenantMemberRoleArgsType = {
  id: string;
};

export type AggregateTenantMemberRoleArgsType = {
  where: TenantMemberRoleBoolExp;
  orderBy?: Array<TenantMemberRoleOrderBy>;
  distinctOn?: Array<TenantMemberRoleSelectColumn>;
  limit?: number;
  offset?: number;
};
