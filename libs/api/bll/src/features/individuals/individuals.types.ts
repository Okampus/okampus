import type {
  IndividualInsertInput,
  IndividualOnConflict,
  IndividualSetInput,
  IndividualBoolExp,
  IndividualOrderBy,
  IndividualSelectColumn,
  IndividualPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertIndividualArgsType = {
  objects: Array<IndividualInsertInput>;
  onConflict?: IndividualOnConflict;
};

export type InsertOneIndividualArgsType = {
  object: IndividualInsertInput;
  onConflict?: IndividualOnConflict;
};

export type UpdateIndividualArgsType = {
  where: IndividualBoolExp;
  _set: IndividualSetInput;
};

export type DeleteIndividualArgsType = {
  where: IndividualBoolExp;
};

export type UpdateByPkIndividualArgsType = {
  pkColumns: IndividualPkColumnsInput;
  _set: IndividualSetInput;
};

export type FindIndividualArgsType = {
  where: IndividualBoolExp;
  orderBy?: Array<IndividualOrderBy>;
  distinctOn?: Array<IndividualSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkIndividualArgsType = {
  id: string;
};

export type AggregateIndividualArgsType = {
  where: IndividualBoolExp;
  orderBy?: Array<IndividualOrderBy>;
  distinctOn?: Array<IndividualSelectColumn>;
  limit?: number;
  offset?: number;
};
