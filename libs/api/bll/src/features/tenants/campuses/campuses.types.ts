import type {
  CampusInsertInput,
  CampusOnConflict,
  CampusSetInput,
  CampusBoolExp,
  CampusOrderBy,
  CampusSelectColumn,
  CampusPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertCampusArgsType = {
  objects: Array<CampusInsertInput>;
  onConflict?: CampusOnConflict;
};

export type InsertOneCampusArgsType = {
  object: CampusInsertInput;
  onConflict?: CampusOnConflict;
};

export type UpdateCampusArgsType = {
  where: CampusBoolExp;
  _set: CampusSetInput;
};

export type DeleteCampusArgsType = {
  where: CampusBoolExp;
};

export type DeleteByPkCampusArgsType = {
  id: string;
};

export type UpdateByPkCampusArgsType = {
  pkColumns: CampusPkColumnsInput;
  _set: CampusSetInput;
};

export type FindCampusArgsType = {
  where: CampusBoolExp;
  orderBy?: Array<CampusOrderBy>;
  distinctOn?: Array<CampusSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkCampusArgsType = {
  id: string;
};

export type AggregateCampusArgsType = {
  where: CampusBoolExp;
  orderBy?: Array<CampusOrderBy>;
  distinctOn?: Array<CampusSelectColumn>;
  limit?: number;
  offset?: number;
};
