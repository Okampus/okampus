import type {
  ActorTagInsertInput,
  ActorTagOnConflict,
  ActorTagSetInput,
  ActorTagBoolExp,
  ActorTagOrderBy,
  ActorTagSelectColumn,
  ActorTagPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertActorTagArgsType = {
  objects: Array<ActorTagInsertInput>;
  onConflict?: ActorTagOnConflict;
};

export type InsertOneActorTagArgsType = {
  object: ActorTagInsertInput;
  onConflict?: ActorTagOnConflict;
};

export type UpdateActorTagArgsType = {
  where: ActorTagBoolExp;
  _set: ActorTagSetInput;
};

export type DeleteActorTagArgsType = {
  where: ActorTagBoolExp;
};

export type DeleteByPkActorTagArgsType = {
  id: string;
};

export type UpdateByPkActorTagArgsType = {
  pkColumns: ActorTagPkColumnsInput;
  _set: ActorTagSetInput;
};

export type FindActorTagArgsType = {
  where: ActorTagBoolExp;
  orderBy?: Array<ActorTagOrderBy>;
  distinctOn?: Array<ActorTagSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkActorTagArgsType = {
  id: string;
};

export type AggregateActorTagArgsType = {
  where: ActorTagBoolExp;
  orderBy?: Array<ActorTagOrderBy>;
  distinctOn?: Array<ActorTagSelectColumn>;
  limit?: number;
  offset?: number;
};
