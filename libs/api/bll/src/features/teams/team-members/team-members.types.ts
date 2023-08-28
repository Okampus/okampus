import type {
  TeamMemberInsertInput,
  TeamMemberOnConflict,
  TeamMemberSetInput,
  TeamMemberBoolExp,
  TeamMemberOrderBy,
  TeamMemberSelectColumn,
  TeamMemberPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTeamMemberArgsType = {
  objects: Array<TeamMemberInsertInput>;
  onConflict?: TeamMemberOnConflict;
};

export type InsertOneTeamMemberArgsType = {
  object: TeamMemberInsertInput;
  onConflict?: TeamMemberOnConflict;
};

export type UpdateTeamMemberArgsType = {
  where: TeamMemberBoolExp;
  _set: TeamMemberSetInput;
};

export type DeleteTeamMemberArgsType = {
  where: TeamMemberBoolExp;
};

export type DeleteByPkTeamMemberArgsType = {
  id: string;
};

export type UpdateByPkTeamMemberArgsType = {
  pkColumns: TeamMemberPkColumnsInput;
  _set: TeamMemberSetInput;
};

export type FindTeamMemberArgsType = {
  where: TeamMemberBoolExp;
  orderBy?: Array<TeamMemberOrderBy>;
  distinctOn?: Array<TeamMemberSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTeamMemberArgsType = {
  id: string;
};

export type AggregateTeamMemberArgsType = {
  where: TeamMemberBoolExp;
  orderBy?: Array<TeamMemberOrderBy>;
  distinctOn?: Array<TeamMemberSelectColumn>;
  limit?: number;
  offset?: number;
};
