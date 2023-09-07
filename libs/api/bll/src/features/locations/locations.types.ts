import type {
  LocationInsertInput,
  LocationOnConflict,
  LocationSetInput,
  LocationBoolExp,
  LocationOrderBy,
  LocationSelectColumn,
  LocationPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertLocationArgsType = {
  objects: Array<LocationInsertInput>;
  onConflict?: LocationOnConflict;
};

export type InsertOneLocationArgsType = {
  object: LocationInsertInput;
  onConflict?: LocationOnConflict;
};

export type UpdateLocationArgsType = {
  where: LocationBoolExp;
  _set: LocationSetInput;
};

export type DeleteLocationArgsType = {
  where: LocationBoolExp;
};

export type DeleteByPkLocationArgsType = {
  id: string;
};

export type UpdateByPkLocationArgsType = {
  pkColumns: LocationPkColumnsInput;
  _set: LocationSetInput;
};

export type FindLocationArgsType = {
  where: LocationBoolExp;
  orderBy?: Array<LocationOrderBy>;
  distinctOn?: Array<LocationSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkLocationArgsType = {
  id: string;
};

export type AggregateLocationArgsType = {
  where: LocationBoolExp;
  orderBy?: Array<LocationOrderBy>;
  distinctOn?: Array<LocationSelectColumn>;
  limit?: number;
  offset?: number;
};
