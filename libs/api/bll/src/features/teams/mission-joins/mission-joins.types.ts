import type {
  MissionJoinInsertInput,
  MissionJoinOnConflict,
  MissionJoinSetInput,
  MissionJoinBoolExp,
  MissionJoinOrderBy,
  MissionJoinSelectColumn,
  MissionJoinPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertMissionJoinArgsType = {
  objects: Array<MissionJoinInsertInput>;
  onConflict?: MissionJoinOnConflict;
};

export type InsertOneMissionJoinArgsType = {
  object: MissionJoinInsertInput;
  onConflict?: MissionJoinOnConflict;
};

export type UpdateMissionJoinArgsType = {
  where: MissionJoinBoolExp;
  _set: MissionJoinSetInput;
};

export type DeleteMissionJoinArgsType = {
  where: MissionJoinBoolExp;
};

export type UpdateByPkMissionJoinArgsType = {
  pkColumns: MissionJoinPkColumnsInput;
  _set: MissionJoinSetInput;
};

export type FindMissionJoinArgsType = {
  where: MissionJoinBoolExp;
  orderBy?: Array<MissionJoinOrderBy>;
  distinctOn?: Array<MissionJoinSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkMissionJoinArgsType = {
  id: string;
};

export type AggregateMissionJoinArgsType = {
  where: MissionJoinBoolExp;
  orderBy?: Array<MissionJoinOrderBy>;
  distinctOn?: Array<MissionJoinSelectColumn>;
  limit?: number;
  offset?: number;
};
