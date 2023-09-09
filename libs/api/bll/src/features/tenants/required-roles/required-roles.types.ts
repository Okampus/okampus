import type {
  RequiredRoleInsertInput,
  RequiredRoleOnConflict,
  RequiredRoleSetInput,
  RequiredRoleBoolExp,
  RequiredRoleOrderBy,
  RequiredRoleSelectColumn,
  RequiredRolePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertRequiredRoleArgsType = {
  objects: Array<RequiredRoleInsertInput>;
  onConflict?: RequiredRoleOnConflict;
};

export type InsertOneRequiredRoleArgsType = {
  object: RequiredRoleInsertInput;
  onConflict?: RequiredRoleOnConflict;
};

export type UpdateRequiredRoleArgsType = {
  where: RequiredRoleBoolExp;
  _set: RequiredRoleSetInput;
};

export type DeleteRequiredRoleArgsType = {
  where: RequiredRoleBoolExp;
};

export type DeleteByPkRequiredRoleArgsType = {
  id: string;
};

export type UpdateByPkRequiredRoleArgsType = {
  pkColumns: RequiredRolePkColumnsInput;
  _set: RequiredRoleSetInput;
};

export type FindRequiredRoleArgsType = {
  where: RequiredRoleBoolExp;
  orderBy?: Array<RequiredRoleOrderBy>;
  distinctOn?: Array<RequiredRoleSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkRequiredRoleArgsType = {
  id: string;
};

export type AggregateRequiredRoleArgsType = {
  where: RequiredRoleBoolExp;
  orderBy?: Array<RequiredRoleOrderBy>;
  distinctOn?: Array<RequiredRoleSelectColumn>;
  limit?: number;
  offset?: number;
};
