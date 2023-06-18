import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertEventAttendanceArgsType = {
  objects: Array<ValueTypes['EventAttendanceInsertInput']>;
  onConflict?: ValueTypes['EventAttendanceOnConflict'];
};

export type InsertOneEventAttendanceArgsType = {
  object: ValueTypes['EventAttendanceInsertInput'];
  onConflict?: ValueTypes['EventAttendanceOnConflict'];
};

export type UpdateEventAttendanceArgsType = {
  where: ValueTypes['EventAttendanceBoolExp'];
  _set: ValueTypes['EventAttendanceSetInput'];
};

export type DeleteEventAttendanceArgsType = {
  where: ValueTypes['EventAttendanceBoolExp'];
};

export type UpdateByPkEventAttendanceArgsType = {
  pkColumns: ValueTypes['EventAttendancePkColumnsInput'];
  _set: ValueTypes['EventAttendanceSetInput'];
};

export type FindEventAttendanceArgsType = {
  where: ValueTypes['EventAttendanceBoolExp'];
  orderBy?: Array<ValueTypes['EventAttendanceOrderBy']>;
  distinctOn?: Array<ValueTypes['EventAttendanceSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkEventAttendanceArgsType = {
  id: string;
};

export type AggregateEventAttendanceArgsType = {
  where: ValueTypes['EventAttendanceBoolExp'];
  orderBy?: Array<ValueTypes['EventAttendanceOrderBy']>;
  distinctOn?: Array<ValueTypes['EventAttendanceSelectColumn']>;
  limit?: number;
  offset?: number;
};
