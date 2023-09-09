import type {
  TeamRequiredRoleInsertInput,
  TeamRequiredRoleOnConflict,
  TeamRequiredRoleSetInput,
  TeamRequiredRoleBoolExp,
  TeamRequiredRoleOrderBy,
  TeamRequiredRoleSelectColumn,
  TeamRequiredRolePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTeamRequiredRoleArgsType = {
  objects: Array<TeamRequiredRoleInsertInput>;
  onConflict?: TeamRequiredRoleOnConflict;
};

export type InsertOneTeamRequiredRoleArgsType = {
  object: TeamRequiredRoleInsertInput;
  onConflict?: TeamRequiredRoleOnConflict;
};

export type UpdateTeamRequiredRoleArgsType = {
  where: TeamRequiredRoleBoolExp;
  _set: TeamRequiredRoleSetInput;
};

export type DeleteTeamRequiredRoleArgsType = {
  where: TeamRequiredRoleBoolExp;
};

export type DeleteByPkTeamRequiredRoleArgsType = {
  id: string;
};

export type UpdateByPkTeamRequiredRoleArgsType = {
  pkColumns: TeamRequiredRolePkColumnsInput;
  _set: TeamRequiredRoleSetInput;
};

export type FindTeamRequiredRoleArgsType = {
  where: TeamRequiredRoleBoolExp;
  orderBy?: Array<TeamRequiredRoleOrderBy>;
  distinctOn?: Array<TeamRequiredRoleSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTeamRequiredRoleArgsType = {
  id: string;
};

export type AggregateTeamRequiredRoleArgsType = {
  where: TeamRequiredRoleBoolExp;
  orderBy?: Array<TeamRequiredRoleOrderBy>;
  distinctOn?: Array<TeamRequiredRoleSelectColumn>;
  limit?: number;
  offset?: number;
};
