import type {
  CampusClusterInsertInput,
  CampusClusterOnConflict,
  CampusClusterSetInput,
  CampusClusterBoolExp,
  CampusClusterOrderBy,
  CampusClusterSelectColumn,
  CampusClusterPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertCampusClusterArgsType = {
  objects: Array<CampusClusterInsertInput>;
  onConflict?: CampusClusterOnConflict;
};

export type InsertOneCampusClusterArgsType = {
  object: CampusClusterInsertInput;
  onConflict?: CampusClusterOnConflict;
};

export type UpdateCampusClusterArgsType = {
  where: CampusClusterBoolExp;
  _set: CampusClusterSetInput;
};

export type DeleteCampusClusterArgsType = {
  where: CampusClusterBoolExp;
};

export type DeleteByPkCampusClusterArgsType = {
  id: string;
};

export type UpdateByPkCampusClusterArgsType = {
  pkColumns: CampusClusterPkColumnsInput;
  _set: CampusClusterSetInput;
};

export type FindCampusClusterArgsType = {
  where: CampusClusterBoolExp;
  orderBy?: Array<CampusClusterOrderBy>;
  distinctOn?: Array<CampusClusterSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkCampusClusterArgsType = {
  id: string;
};

export type AggregateCampusClusterArgsType = {
  where: CampusClusterBoolExp;
  orderBy?: Array<CampusClusterOrderBy>;
  distinctOn?: Array<CampusClusterSelectColumn>;
  limit?: number;
  offset?: number;
};
