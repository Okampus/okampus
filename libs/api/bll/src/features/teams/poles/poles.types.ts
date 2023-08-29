import type {
  PoleInsertInput,
  PoleOnConflict,
  PoleSetInput,
  PoleBoolExp,
  PoleOrderBy,
  PoleSelectColumn,
  PolePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertPoleArgsType = {
  objects: Array<PoleInsertInput>;
  onConflict?: PoleOnConflict;
};

export type InsertOnePoleArgsType = {
  object: PoleInsertInput;
  onConflict?: PoleOnConflict;
};

export type UpdatePoleArgsType = {
  where: PoleBoolExp;
  _set: PoleSetInput;
};

export type DeletePoleArgsType = {
  where: PoleBoolExp;
};

export type DeleteByPkPoleArgsType = {
  id: string;
};

export type UpdateByPkPoleArgsType = {
  pkColumns: PolePkColumnsInput;
  _set: PoleSetInput;
};

export type FindPoleArgsType = {
  where: PoleBoolExp;
  orderBy?: Array<PoleOrderBy>;
  distinctOn?: Array<PoleSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkPoleArgsType = {
  id: string;
};

export type AggregatePoleArgsType = {
  where: PoleBoolExp;
  orderBy?: Array<PoleOrderBy>;
  distinctOn?: Array<PoleSelectColumn>;
  limit?: number;
  offset?: number;
};
