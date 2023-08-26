import type {
  ActorInsertInput,
  ActorOnConflict,
  ActorSetInput,
  ActorBoolExp,
  ActorOrderBy,
  ActorSelectColumn,
  ActorPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertActorArgsType = {
  objects: Array<ActorInsertInput>;
  onConflict?: ActorOnConflict;
};

export type InsertOneActorArgsType = {
  object: ActorInsertInput;
  onConflict?: ActorOnConflict;
};

export type UpdateActorArgsType = {
  where: ActorBoolExp;
  _set: ActorSetInput;
};

export type DeleteActorArgsType = {
  where: ActorBoolExp;
};

export type DeleteByPkActorArgsType = {
  id: string;
};

export type UpdateByPkActorArgsType = {
  pkColumns: ActorPkColumnsInput;
  _set: ActorSetInput;
};

export type FindActorArgsType = {
  where: ActorBoolExp;
  orderBy?: Array<ActorOrderBy>;
  distinctOn?: Array<ActorSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkActorArgsType = {
  id: string;
};

export type AggregateActorArgsType = {
  where: ActorBoolExp;
  orderBy?: Array<ActorOrderBy>;
  distinctOn?: Array<ActorSelectColumn>;
  limit?: number;
  offset?: number;
};
