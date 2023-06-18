import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertActorArgsType = {
  objects: Array<ValueTypes['ActorInsertInput']>;
  onConflict?: ValueTypes['ActorOnConflict'];
};

export type InsertOneActorArgsType = {
  object: ValueTypes['ActorInsertInput'];
  onConflict?: ValueTypes['ActorOnConflict'];
};

export type UpdateActorArgsType = {
  where: ValueTypes['ActorBoolExp'];
  _set: ValueTypes['ActorSetInput'];
};

export type DeleteActorArgsType = {
  where: ValueTypes['ActorBoolExp'];
};

export type UpdateByPkActorArgsType = {
  pkColumns: ValueTypes['ActorPkColumnsInput'];
  _set: ValueTypes['ActorSetInput'];
};

export type FindActorArgsType = {
  where: ValueTypes['ActorBoolExp'];
  orderBy?: Array<ValueTypes['ActorOrderBy']>;
  distinctOn?: Array<ValueTypes['ActorSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkActorArgsType = {
  id: string;
};

export type AggregateActorArgsType = {
  where: ValueTypes['ActorBoolExp'];
  orderBy?: Array<ValueTypes['ActorOrderBy']>;
  distinctOn?: Array<ValueTypes['ActorSelectColumn']>;
  limit?: number;
  offset?: number;
};
