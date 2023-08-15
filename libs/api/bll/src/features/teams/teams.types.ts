import type {
  TeamInsertInput,
  TeamOnConflict,
  TeamSetInput,
  TeamBoolExp,
  TeamOrderBy,
  TeamSelectColumn,
  TeamPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTeamArgsType = {
  objects: Array<TeamInsertInput>;
  onConflict?: TeamOnConflict;
};

export type InsertOneTeamArgsType = {
  object: TeamInsertInput;
  onConflict?: TeamOnConflict;
};

export type UpdateTeamArgsType = {
  where: TeamBoolExp;
  _set: TeamSetInput;
};

export type DeleteTeamArgsType = {
  where: TeamBoolExp;
};

export type UpdateByPkTeamArgsType = {
  pkColumns: TeamPkColumnsInput;
  _set: TeamSetInput;
};

export type FindTeamArgsType = {
  where: TeamBoolExp;
  orderBy?: Array<TeamOrderBy>;
  distinctOn?: Array<TeamSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTeamArgsType = {
  id: string;
};

export type AggregateTeamArgsType = {
  where: TeamBoolExp;
  orderBy?: Array<TeamOrderBy>;
  distinctOn?: Array<TeamSelectColumn>;
  limit?: number;
  offset?: number;
};
