import type {
  GrantInsertInput,
  GrantOnConflict,
  GrantSetInput,
  GrantBoolExp,
  GrantOrderBy,
  GrantSelectColumn,
  GrantPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertGrantArgsType = {
  objects: Array<GrantInsertInput>;
  onConflict?: GrantOnConflict;
};

export type InsertOneGrantArgsType = {
  object: GrantInsertInput;
  onConflict?: GrantOnConflict;
};

export type UpdateGrantArgsType = {
  where: GrantBoolExp;
  _set: GrantSetInput;
};

export type DeleteGrantArgsType = {
  where: GrantBoolExp;
};

export type DeleteByPkGrantArgsType = {
  id: string;
};

export type UpdateByPkGrantArgsType = {
  pkColumns: GrantPkColumnsInput;
  _set: GrantSetInput;
};

export type FindGrantArgsType = {
  where: GrantBoolExp;
  orderBy?: Array<GrantOrderBy>;
  distinctOn?: Array<GrantSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkGrantArgsType = {
  id: string;
};

export type AggregateGrantArgsType = {
  where: GrantBoolExp;
  orderBy?: Array<GrantOrderBy>;
  distinctOn?: Array<GrantSelectColumn>;
  limit?: number;
  offset?: number;
};
