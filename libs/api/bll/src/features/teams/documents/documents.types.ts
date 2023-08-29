import type {
  DocumentInsertInput,
  DocumentOnConflict,
  DocumentSetInput,
  DocumentBoolExp,
  DocumentOrderBy,
  DocumentSelectColumn,
  DocumentPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertDocumentArgsType = {
  objects: Array<DocumentInsertInput>;
  onConflict?: DocumentOnConflict;
};

export type InsertOneDocumentArgsType = {
  object: DocumentInsertInput;
  onConflict?: DocumentOnConflict;
};

export type UpdateDocumentArgsType = {
  where: DocumentBoolExp;
  _set: DocumentSetInput;
};

export type DeleteDocumentArgsType = {
  where: DocumentBoolExp;
};

export type DeleteByPkDocumentArgsType = {
  id: string;
};

export type UpdateByPkDocumentArgsType = {
  pkColumns: DocumentPkColumnsInput;
  _set: DocumentSetInput;
};

export type FindDocumentArgsType = {
  where: DocumentBoolExp;
  orderBy?: Array<DocumentOrderBy>;
  distinctOn?: Array<DocumentSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkDocumentArgsType = {
  id: string;
};

export type AggregateDocumentArgsType = {
  where: DocumentBoolExp;
  orderBy?: Array<DocumentOrderBy>;
  distinctOn?: Array<DocumentSelectColumn>;
  limit?: number;
  offset?: number;
};
