import type {
  LegalUnitLocationInsertInput,
  LegalUnitLocationOnConflict,
  LegalUnitLocationSetInput,
  LegalUnitLocationBoolExp,
  LegalUnitLocationOrderBy,
  LegalUnitLocationSelectColumn,
  LegalUnitLocationPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertLegalUnitLocationArgsType = {
  objects: Array<LegalUnitLocationInsertInput>;
  onConflict?: LegalUnitLocationOnConflict;
};

export type InsertOneLegalUnitLocationArgsType = {
  object: LegalUnitLocationInsertInput;
  onConflict?: LegalUnitLocationOnConflict;
};

export type UpdateLegalUnitLocationArgsType = {
  where: LegalUnitLocationBoolExp;
  _set: LegalUnitLocationSetInput;
};

export type DeleteLegalUnitLocationArgsType = {
  where: LegalUnitLocationBoolExp;
};

export type DeleteByPkLegalUnitLocationArgsType = {
  id: string;
};

export type UpdateByPkLegalUnitLocationArgsType = {
  pkColumns: LegalUnitLocationPkColumnsInput;
  _set: LegalUnitLocationSetInput;
};

export type FindLegalUnitLocationArgsType = {
  where: LegalUnitLocationBoolExp;
  orderBy?: Array<LegalUnitLocationOrderBy>;
  distinctOn?: Array<LegalUnitLocationSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkLegalUnitLocationArgsType = {
  id: string;
};

export type AggregateLegalUnitLocationArgsType = {
  where: LegalUnitLocationBoolExp;
  orderBy?: Array<LegalUnitLocationOrderBy>;
  distinctOn?: Array<LegalUnitLocationSelectColumn>;
  limit?: number;
  offset?: number;
};
