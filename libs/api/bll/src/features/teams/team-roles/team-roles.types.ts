import type {
  TeamRoleInsertInput,
  TeamRoleOnConflict,
  TeamRoleSetInput,
  TeamRoleBoolExp,
  TeamRoleOrderBy,
  TeamRoleSelectColumn,
  TeamRolePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTeamRoleArgsType = {
  objects: Array<TeamRoleInsertInput>;
  onConflict?: TeamRoleOnConflict;
};

export type InsertOneTeamRoleArgsType = {
  object: TeamRoleInsertInput;
  onConflict?: TeamRoleOnConflict;
};

export type UpdateTeamRoleArgsType = {
  where: TeamRoleBoolExp;
  _set: TeamRoleSetInput;
};

export type DeleteTeamRoleArgsType = {
  where: TeamRoleBoolExp;
};

export type DeleteByPkTeamRoleArgsType = {
  id: string;
};

export type UpdateByPkTeamRoleArgsType = {
  pkColumns: TeamRolePkColumnsInput;
  _set: TeamRoleSetInput;
};

export type FindTeamRoleArgsType = {
  where: TeamRoleBoolExp;
  orderBy?: Array<TeamRoleOrderBy>;
  distinctOn?: Array<TeamRoleSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTeamRoleArgsType = {
  id: string;
};

export type AggregateTeamRoleArgsType = {
  where: TeamRoleBoolExp;
  orderBy?: Array<TeamRoleOrderBy>;
  distinctOn?: Array<TeamRoleSelectColumn>;
  limit?: number;
  offset?: number;
};
