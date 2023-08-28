import type {
  FormInsertInput,
  FormOnConflict,
  FormSetInput,
  FormBoolExp,
  FormOrderBy,
  FormSelectColumn,
  FormPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertFormArgsType = {
  objects: Array<FormInsertInput>;
  onConflict?: FormOnConflict;
};

export type InsertOneFormArgsType = {
  object: FormInsertInput;
  onConflict?: FormOnConflict;
};

export type UpdateFormArgsType = {
  where: FormBoolExp;
  _set: FormSetInput;
};

export type DeleteFormArgsType = {
  where: FormBoolExp;
};

export type DeleteByPkFormArgsType = {
  id: string;
};

export type UpdateByPkFormArgsType = {
  pkColumns: FormPkColumnsInput;
  _set: FormSetInput;
};

export type FindFormArgsType = {
  where: FormBoolExp;
  orderBy?: Array<FormOrderBy>;
  distinctOn?: Array<FormSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkFormArgsType = {
  id: string;
};

export type AggregateFormArgsType = {
  where: FormBoolExp;
  orderBy?: Array<FormOrderBy>;
  distinctOn?: Array<FormSelectColumn>;
  limit?: number;
  offset?: number;
};
