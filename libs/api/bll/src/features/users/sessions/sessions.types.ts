import type {
  SessionInsertInput,
  SessionOnConflict,
  SessionSetInput,
  SessionBoolExp,
  SessionOrderBy,
  SessionSelectColumn,
  SessionPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertSessionArgsType = {
  objects: Array<SessionInsertInput>;
  onConflict?: SessionOnConflict;
};

export type InsertOneSessionArgsType = {
  object: SessionInsertInput;
  onConflict?: SessionOnConflict;
};

export type UpdateSessionArgsType = {
  where: SessionBoolExp;
  _set: SessionSetInput;
};

export type DeleteSessionArgsType = {
  where: SessionBoolExp;
};

export type DeleteByPkSessionArgsType = {
  id: string;
};

export type UpdateByPkSessionArgsType = {
  pkColumns: SessionPkColumnsInput;
  _set: SessionSetInput;
};

export type FindSessionArgsType = {
  where: SessionBoolExp;
  orderBy?: Array<SessionOrderBy>;
  distinctOn?: Array<SessionSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkSessionArgsType = {
  id: string;
};

export type AggregateSessionArgsType = {
  where: SessionBoolExp;
  orderBy?: Array<SessionOrderBy>;
  distinctOn?: Array<SessionSelectColumn>;
  limit?: number;
  offset?: number;
};
