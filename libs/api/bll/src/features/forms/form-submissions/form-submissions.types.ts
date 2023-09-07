import type {
  FormSubmissionInsertInput,
  FormSubmissionOnConflict,
  FormSubmissionSetInput,
  FormSubmissionBoolExp,
  FormSubmissionOrderBy,
  FormSubmissionSelectColumn,
  FormSubmissionPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertFormSubmissionArgsType = {
  objects: Array<FormSubmissionInsertInput>;
  onConflict?: FormSubmissionOnConflict;
};

export type InsertOneFormSubmissionArgsType = {
  object: FormSubmissionInsertInput;
  onConflict?: FormSubmissionOnConflict;
};

export type UpdateFormSubmissionArgsType = {
  where: FormSubmissionBoolExp;
  _set: FormSubmissionSetInput;
};

export type DeleteFormSubmissionArgsType = {
  where: FormSubmissionBoolExp;
};

export type DeleteByPkFormSubmissionArgsType = {
  id: string;
};

export type UpdateByPkFormSubmissionArgsType = {
  pkColumns: FormSubmissionPkColumnsInput;
  _set: FormSubmissionSetInput;
};

export type FindFormSubmissionArgsType = {
  where: FormSubmissionBoolExp;
  orderBy?: Array<FormSubmissionOrderBy>;
  distinctOn?: Array<FormSubmissionSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkFormSubmissionArgsType = {
  id: string;
};

export type AggregateFormSubmissionArgsType = {
  where: FormSubmissionBoolExp;
  orderBy?: Array<FormSubmissionOrderBy>;
  distinctOn?: Array<FormSubmissionSelectColumn>;
  limit?: number;
  offset?: number;
};
