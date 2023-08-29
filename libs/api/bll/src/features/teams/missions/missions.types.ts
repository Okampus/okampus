import type {
  MissionInsertInput,
  MissionOnConflict,
  MissionSetInput,
  MissionBoolExp,
  MissionOrderBy,
  MissionSelectColumn,
  MissionPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertMissionArgsType = {
  objects: Array<MissionInsertInput>;
  onConflict?: MissionOnConflict;
};

export type InsertOneMissionArgsType = {
  object: MissionInsertInput;
  onConflict?: MissionOnConflict;
};

export type UpdateMissionArgsType = {
  where: MissionBoolExp;
  _set: MissionSetInput;
};

export type DeleteMissionArgsType = {
  where: MissionBoolExp;
};

export type DeleteByPkMissionArgsType = {
  id: string;
};

export type UpdateByPkMissionArgsType = {
  pkColumns: MissionPkColumnsInput;
  _set: MissionSetInput;
};

export type FindMissionArgsType = {
  where: MissionBoolExp;
  orderBy?: Array<MissionOrderBy>;
  distinctOn?: Array<MissionSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkMissionArgsType = {
  id: string;
};

export type AggregateMissionArgsType = {
  where: MissionBoolExp;
  orderBy?: Array<MissionOrderBy>;
  distinctOn?: Array<MissionSelectColumn>;
  limit?: number;
  offset?: number;
};
