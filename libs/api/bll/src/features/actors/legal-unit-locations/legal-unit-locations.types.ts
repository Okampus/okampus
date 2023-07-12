import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertLegalUnitLocationArgsType = {
  objects: Array<ValueTypes['LegalUnitLocationInsertInput']>;
  onConflict?: ValueTypes['LegalUnitLocationOnConflict'];
};

export type InsertOneLegalUnitLocationArgsType = {
  object: ValueTypes['LegalUnitLocationInsertInput'];
  onConflict?: ValueTypes['LegalUnitLocationOnConflict'];
};

export type UpdateLegalUnitLocationArgsType = {
  where: ValueTypes['LegalUnitLocationBoolExp'];
  _set: ValueTypes['LegalUnitLocationSetInput'];
};

export type DeleteLegalUnitLocationArgsType = {
  where: ValueTypes['LegalUnitLocationBoolExp'];
};

export type UpdateByPkLegalUnitLocationArgsType = {
  pkColumns: ValueTypes['LegalUnitLocationPkColumnsInput'];
  _set: ValueTypes['LegalUnitLocationSetInput'];
};

export type FindLegalUnitLocationArgsType = {
  where: ValueTypes['LegalUnitLocationBoolExp'];
  orderBy?: Array<ValueTypes['LegalUnitLocationOrderBy']>;
  distinctOn?: Array<ValueTypes['LegalUnitLocationSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkLegalUnitLocationArgsType = {
  id: string;
};

export type AggregateLegalUnitLocationArgsType = {
  where: ValueTypes['LegalUnitLocationBoolExp'];
  orderBy?: Array<ValueTypes['LegalUnitLocationOrderBy']>;
  distinctOn?: Array<ValueTypes['LegalUnitLocationSelectColumn']>;
  limit?: number;
  offset?: number;
};
