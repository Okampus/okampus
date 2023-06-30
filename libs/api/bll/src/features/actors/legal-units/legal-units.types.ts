import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertLegalUnitArgsType = {
  objects: Array<ValueTypes['LegalUnitInsertInput']>;
  onConflict?: ValueTypes['LegalUnitOnConflict'];
};

export type InsertOneLegalUnitArgsType = {
  object: ValueTypes['LegalUnitInsertInput'];
  onConflict?: ValueTypes['LegalUnitOnConflict'];
};

export type UpdateLegalUnitArgsType = {
  where: ValueTypes['LegalUnitBoolExp'];
  _set: ValueTypes['LegalUnitSetInput'];
};

export type DeleteLegalUnitArgsType = {
  where: ValueTypes['LegalUnitBoolExp'];
};

export type UpdateByPkLegalUnitArgsType = {
  pkColumns: ValueTypes['LegalUnitPkColumnsInput'];
  _set: ValueTypes['LegalUnitSetInput'];
};

export type FindLegalUnitArgsType = {
  where: ValueTypes['LegalUnitBoolExp'];
  orderBy?: Array<ValueTypes['LegalUnitOrderBy']>;
  distinctOn?: Array<ValueTypes['LegalUnitSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkLegalUnitArgsType = {
  id: string;
};

export type AggregateLegalUnitArgsType = {
  where: ValueTypes['LegalUnitBoolExp'];
  orderBy?: Array<ValueTypes['LegalUnitOrderBy']>;
  distinctOn?: Array<ValueTypes['LegalUnitSelectColumn']>;
  limit?: number;
  offset?: number;
};
