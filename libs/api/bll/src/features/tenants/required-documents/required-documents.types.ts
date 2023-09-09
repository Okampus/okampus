import type {
  RequiredDocumentInsertInput,
  RequiredDocumentOnConflict,
  RequiredDocumentSetInput,
  RequiredDocumentBoolExp,
  RequiredDocumentOrderBy,
  RequiredDocumentSelectColumn,
  RequiredDocumentPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertRequiredDocumentArgsType = {
  objects: Array<RequiredDocumentInsertInput>;
  onConflict?: RequiredDocumentOnConflict;
};

export type InsertOneRequiredDocumentArgsType = {
  object: RequiredDocumentInsertInput;
  onConflict?: RequiredDocumentOnConflict;
};

export type UpdateRequiredDocumentArgsType = {
  where: RequiredDocumentBoolExp;
  _set: RequiredDocumentSetInput;
};

export type DeleteRequiredDocumentArgsType = {
  where: RequiredDocumentBoolExp;
};

export type DeleteByPkRequiredDocumentArgsType = {
  id: string;
};

export type UpdateByPkRequiredDocumentArgsType = {
  pkColumns: RequiredDocumentPkColumnsInput;
  _set: RequiredDocumentSetInput;
};

export type FindRequiredDocumentArgsType = {
  where: RequiredDocumentBoolExp;
  orderBy?: Array<RequiredDocumentOrderBy>;
  distinctOn?: Array<RequiredDocumentSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkRequiredDocumentArgsType = {
  id: string;
};

export type AggregateRequiredDocumentArgsType = {
  where: RequiredDocumentBoolExp;
  orderBy?: Array<RequiredDocumentOrderBy>;
  distinctOn?: Array<RequiredDocumentSelectColumn>;
  limit?: number;
  offset?: number;
};
