import type {
  TagInsertInput,
  TagOnConflict,
  TagSetInput,
  TagBoolExp,
  TagOrderBy,
  TagSelectColumn,
  TagPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertTagArgsType = {
  objects: Array<TagInsertInput>;
  onConflict?: TagOnConflict;
};

export type InsertOneTagArgsType = {
  object: TagInsertInput;
  onConflict?: TagOnConflict;
};

export type UpdateTagArgsType = {
  where: TagBoolExp;
  _set: TagSetInput;
};

export type DeleteTagArgsType = {
  where: TagBoolExp;
};

export type DeleteByPkTagArgsType = {
  id: string;
};

export type UpdateByPkTagArgsType = {
  pkColumns: TagPkColumnsInput;
  _set: TagSetInput;
};

export type FindTagArgsType = {
  where: TagBoolExp;
  orderBy?: Array<TagOrderBy>;
  distinctOn?: Array<TagSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkTagArgsType = {
  id: string;
};

export type AggregateTagArgsType = {
  where: TagBoolExp;
  orderBy?: Array<TagOrderBy>;
  distinctOn?: Array<TagSelectColumn>;
  limit?: number;
  offset?: number;
};
