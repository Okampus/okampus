import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertActorImageArgsType = {
  objects: Array<ValueTypes['ActorImageInsertInput']>;
  onConflict?: ValueTypes['ActorImageOnConflict'];
};

export type InsertOneActorImageArgsType = {
  object: ValueTypes['ActorImageInsertInput'];
  onConflict?: ValueTypes['ActorImageOnConflict'];
};

export type UpdateActorImageArgsType = {
  where: ValueTypes['ActorImageBoolExp'];
  _set: ValueTypes['ActorImageSetInput'];
};

export type UpdateByPkActorImageArgsType = {
  pkColumns: ValueTypes['ActorImagePkColumnsInput'];
  _set: ValueTypes['ActorImageSetInput'];
};

export type FindActorImageArgsType = {
  where: ValueTypes['ActorImageBoolExp'];
  orderBy?: Array<ValueTypes['ActorImageOrderBy']>;
  distinctOn?: Array<ValueTypes['ActorImageSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkActorImageArgsType = {
  id: string;
};

export type AggregateActorImageArgsType = {
  where: ValueTypes['ActorImageBoolExp'];
  orderBy?: Array<ValueTypes['ActorImageOrderBy']>;
  distinctOn?: Array<ValueTypes['ActorImageSelectColumn']>;
  limit?: number;
  offset?: number;
};
