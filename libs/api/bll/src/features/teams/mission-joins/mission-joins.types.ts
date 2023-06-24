import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertMissionJoinArgsType = {
  objects: Array<ValueTypes['MissionJoinInsertInput']>;
  onConflict?: ValueTypes['MissionJoinOnConflict'];
};

export type InsertOneMissionJoinArgsType = {
  object: ValueTypes['MissionJoinInsertInput'];
  onConflict?: ValueTypes['MissionJoinOnConflict'];
};

export type UpdateMissionJoinArgsType = {
  where: ValueTypes['MissionJoinBoolExp'];
  _set: ValueTypes['MissionJoinSetInput'];
};

export type DeleteMissionJoinArgsType = {
  where: ValueTypes['MissionJoinBoolExp'];
};

export type UpdateByPkMissionJoinArgsType = {
  pkColumns: ValueTypes['MissionJoinPkColumnsInput'];
  _set: ValueTypes['MissionJoinSetInput'];
};

export type FindMissionJoinArgsType = {
  where: ValueTypes['MissionJoinBoolExp'];
  orderBy?: Array<ValueTypes['MissionJoinOrderBy']>;
  distinctOn?: Array<ValueTypes['MissionJoinSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkMissionJoinArgsType = {
  id: string;
};

export type AggregateMissionJoinArgsType = {
  where: ValueTypes['MissionJoinBoolExp'];
  orderBy?: Array<ValueTypes['MissionJoinOrderBy']>;
  distinctOn?: Array<ValueTypes['MissionJoinSelectColumn']>;
  limit?: number;
  offset?: number;
};
