import type {
  TeamMemberRoleInsertInput,
  TeamMemberRoleOnConflict,
  TeamMemberRoleSetInput,
  TeamMemberRoleBoolExp,
  TeamMemberRoleOrderBy,
  TeamMemberRoleSelectColumn,
  TeamMemberRolePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTeamMemberRoleArgsType = {
  objects: Array<TeamMemberRoleInsertInput>;
  onConflict?: TeamMemberRoleOnConflict;
};

export type InsertOneTeamMemberRoleArgsType = {
  object: TeamMemberRoleInsertInput;
  onConflict?: TeamMemberRoleOnConflict;
};

export type UpdateTeamMemberRoleArgsType = {
  where: TeamMemberRoleBoolExp;
  _set: TeamMemberRoleSetInput;
};

export type DeleteTeamMemberRoleArgsType = {
  where: TeamMemberRoleBoolExp;
};

export type DeleteByPkTeamMemberRoleArgsType = {
  id: string;
};

export type UpdateByPkTeamMemberRoleArgsType = {
  pkColumns: TeamMemberRolePkColumnsInput;
  _set: TeamMemberRoleSetInput;
};

export type FindTeamMemberRoleArgsType = {
  where: TeamMemberRoleBoolExp;
  orderBy?: Array<TeamMemberRoleOrderBy>;
  distinctOn?: Array<TeamMemberRoleSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTeamMemberRoleArgsType = {
  id: string;
};

export type AggregateTeamMemberRoleArgsType = {
  where: TeamMemberRoleBoolExp;
  orderBy?: Array<TeamMemberRoleOrderBy>;
  distinctOn?: Array<TeamMemberRoleSelectColumn>;
  limit?: number;
  offset?: number;
};
