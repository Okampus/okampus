import type {
  TeamHistoryInsertInput,
  TeamHistoryOnConflict,
  TeamHistorySetInput,
  TeamHistoryBoolExp,
  TeamHistoryOrderBy,
  TeamHistorySelectColumn,
  TeamHistoryPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTeamHistoryArgsType = {
  objects: Array<TeamHistoryInsertInput>;
  onConflict?: TeamHistoryOnConflict;
};

export type InsertOneTeamHistoryArgsType = {
  object: TeamHistoryInsertInput;
  onConflict?: TeamHistoryOnConflict;
};

export type UpdateTeamHistoryArgsType = {
  where: TeamHistoryBoolExp;
  _set: TeamHistorySetInput;
};

export type DeleteTeamHistoryArgsType = {
  where: TeamHistoryBoolExp;
};

export type DeleteByPkTeamHistoryArgsType = {
  id: string;
};

export type UpdateByPkTeamHistoryArgsType = {
  pkColumns: TeamHistoryPkColumnsInput;
  _set: TeamHistorySetInput;
};

export type FindTeamHistoryArgsType = {
  where: TeamHistoryBoolExp;
  orderBy?: Array<TeamHistoryOrderBy>;
  distinctOn?: Array<TeamHistorySelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTeamHistoryArgsType = {
  id: string;
};

export type AggregateTeamHistoryArgsType = {
  where: TeamHistoryBoolExp;
  orderBy?: Array<TeamHistoryOrderBy>;
  distinctOn?: Array<TeamHistorySelectColumn>;
  limit?: number;
  offset?: number;
};
