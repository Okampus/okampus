import type {
  TeamDocumentInsertInput,
  TeamDocumentOnConflict,
  TeamDocumentSetInput,
  TeamDocumentBoolExp,
  TeamDocumentOrderBy,
  TeamDocumentSelectColumn,
  TeamDocumentPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTeamDocumentArgsType = {
  objects: Array<TeamDocumentInsertInput>;
  onConflict?: TeamDocumentOnConflict;
};

export type InsertOneTeamDocumentArgsType = {
  object: TeamDocumentInsertInput;
  onConflict?: TeamDocumentOnConflict;
};

export type UpdateTeamDocumentArgsType = {
  where: TeamDocumentBoolExp;
  _set: TeamDocumentSetInput;
};

export type DeleteTeamDocumentArgsType = {
  where: TeamDocumentBoolExp;
};

export type DeleteByPkTeamDocumentArgsType = {
  id: string;
};

export type UpdateByPkTeamDocumentArgsType = {
  pkColumns: TeamDocumentPkColumnsInput;
  _set: TeamDocumentSetInput;
};

export type FindTeamDocumentArgsType = {
  where: TeamDocumentBoolExp;
  orderBy?: Array<TeamDocumentOrderBy>;
  distinctOn?: Array<TeamDocumentSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTeamDocumentArgsType = {
  id: string;
};

export type AggregateTeamDocumentArgsType = {
  where: TeamDocumentBoolExp;
  orderBy?: Array<TeamDocumentOrderBy>;
  distinctOn?: Array<TeamDocumentSelectColumn>;
  limit?: number;
  offset?: number;
};
