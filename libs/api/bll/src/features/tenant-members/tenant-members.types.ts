import type {
  TenantMemberInsertInput,
  TenantMemberOnConflict,
  TenantMemberSetInput,
  TenantMemberBoolExp,
  TenantMemberOrderBy,
  TenantMemberSelectColumn,
  TenantMemberPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTenantMemberArgsType = {
  objects: Array<TenantMemberInsertInput>;
  onConflict?: TenantMemberOnConflict;
};

export type InsertOneTenantMemberArgsType = {
  object: TenantMemberInsertInput;
  onConflict?: TenantMemberOnConflict;
};

export type UpdateTenantMemberArgsType = {
  where: TenantMemberBoolExp;
  _set: TenantMemberSetInput;
};

export type DeleteTenantMemberArgsType = {
  where: TenantMemberBoolExp;
};

export type DeleteByPkTenantMemberArgsType = {
  id: string;
};

export type UpdateByPkTenantMemberArgsType = {
  pkColumns: TenantMemberPkColumnsInput;
  _set: TenantMemberSetInput;
};

export type FindTenantMemberArgsType = {
  where: TenantMemberBoolExp;
  orderBy?: Array<TenantMemberOrderBy>;
  distinctOn?: Array<TenantMemberSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTenantMemberArgsType = {
  id: string;
};

export type AggregateTenantMemberArgsType = {
  where: TenantMemberBoolExp;
  orderBy?: Array<TenantMemberOrderBy>;
  distinctOn?: Array<TenantMemberSelectColumn>;
  limit?: number;
  offset?: number;
};
