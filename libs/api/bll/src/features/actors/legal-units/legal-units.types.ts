import type {
  LegalUnitInsertInput,
  LegalUnitOnConflict,
  LegalUnitSetInput,
  LegalUnitBoolExp,
  LegalUnitOrderBy,
  LegalUnitSelectColumn,
  LegalUnitPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertLegalUnitArgsType = {
  objects: Array<LegalUnitInsertInput>;
  onConflict?: LegalUnitOnConflict;
};

export type InsertOneLegalUnitArgsType = {
  object: LegalUnitInsertInput;
  onConflict?: LegalUnitOnConflict;
};

export type UpdateLegalUnitArgsType = {
  where: LegalUnitBoolExp;
  _set: LegalUnitSetInput;
};

export type DeleteLegalUnitArgsType = {
  where: LegalUnitBoolExp;
};

export type DeleteByPkLegalUnitArgsType = {
  id: string;
};

export type UpdateByPkLegalUnitArgsType = {
  pkColumns: LegalUnitPkColumnsInput;
  _set: LegalUnitSetInput;
};

export type FindLegalUnitArgsType = {
  where: LegalUnitBoolExp;
  orderBy?: Array<LegalUnitOrderBy>;
  distinctOn?: Array<LegalUnitSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkLegalUnitArgsType = {
  id: string;
};

export type AggregateLegalUnitArgsType = {
  where: LegalUnitBoolExp;
  orderBy?: Array<LegalUnitOrderBy>;
  distinctOn?: Array<LegalUnitSelectColumn>;
  limit?: number;
  offset?: number;
};
