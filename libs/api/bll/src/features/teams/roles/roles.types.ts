import type {
  RoleInsertInput,
  RoleOnConflict,
  RoleSetInput,
  RoleBoolExp,
  RoleOrderBy,
  RoleSelectColumn,
  RolePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertRoleArgsType = {
  objects: Array<RoleInsertInput>;
  onConflict?: RoleOnConflict;
};

export type InsertOneRoleArgsType = {
  object: RoleInsertInput;
  onConflict?: RoleOnConflict;
};

export type UpdateRoleArgsType = {
  where: RoleBoolExp;
  _set: RoleSetInput;
};

export type DeleteRoleArgsType = {
  where: RoleBoolExp;
};

export type DeleteByPkRoleArgsType = {
  id: string;
};

export type UpdateByPkRoleArgsType = {
  pkColumns: RolePkColumnsInput;
  _set: RoleSetInput;
};

export type FindRoleArgsType = {
  where: RoleBoolExp;
  orderBy?: Array<RoleOrderBy>;
  distinctOn?: Array<RoleSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkRoleArgsType = {
  id: string;
};

export type AggregateRoleArgsType = {
  where: RoleBoolExp;
  orderBy?: Array<RoleOrderBy>;
  distinctOn?: Array<RoleSelectColumn>;
  limit?: number;
  offset?: number;
};
