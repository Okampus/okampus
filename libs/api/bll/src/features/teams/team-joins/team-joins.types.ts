import type {
  TeamJoinInsertInput,
  TeamJoinOnConflict,
  TeamJoinSetInput,
  TeamJoinBoolExp,
  TeamJoinOrderBy,
  TeamJoinSelectColumn,
  TeamJoinPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTeamJoinArgsType = {
  objects: Array<TeamJoinInsertInput>;
  onConflict?: TeamJoinOnConflict;
};

export type InsertOneTeamJoinArgsType = {
  object: TeamJoinInsertInput;
  onConflict?: TeamJoinOnConflict;
};

export type UpdateTeamJoinArgsType = {
  where: TeamJoinBoolExp;
  _set: TeamJoinSetInput;
};

export type DeleteTeamJoinArgsType = {
  where: TeamJoinBoolExp;
};

export type DeleteByPkTeamJoinArgsType = {
  id: string;
};

export type UpdateByPkTeamJoinArgsType = {
  pkColumns: TeamJoinPkColumnsInput;
  _set: TeamJoinSetInput;
};

export type FindTeamJoinArgsType = {
  where: TeamJoinBoolExp;
  orderBy?: Array<TeamJoinOrderBy>;
  distinctOn?: Array<TeamJoinSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTeamJoinArgsType = {
  id: string;
};

export type AggregateTeamJoinArgsType = {
  where: TeamJoinBoolExp;
  orderBy?: Array<TeamJoinOrderBy>;
  distinctOn?: Array<TeamJoinSelectColumn>;
  limit?: number;
  offset?: number;
};
