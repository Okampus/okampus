import type {
  ActorImageInsertInput,
  ActorImageOnConflict,
  ActorImageSetInput,
  ActorImageBoolExp,
  ActorImageOrderBy,
  ActorImageSelectColumn,
  ActorImagePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertActorImageArgsType = {
  objects: Array<ActorImageInsertInput>;
  onConflict?: ActorImageOnConflict;
};

export type InsertOneActorImageArgsType = {
  object: ActorImageInsertInput;
  onConflict?: ActorImageOnConflict;
};

export type UpdateActorImageArgsType = {
  where: ActorImageBoolExp;
  _set: ActorImageSetInput;
};

export type DeleteActorImageArgsType = {
  where: ActorImageBoolExp;
};

export type UpdateByPkActorImageArgsType = {
  pkColumns: ActorImagePkColumnsInput;
  _set: ActorImageSetInput;
};

export type FindActorImageArgsType = {
  where: ActorImageBoolExp;
  orderBy?: Array<ActorImageOrderBy>;
  distinctOn?: Array<ActorImageSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkActorImageArgsType = {
  id: string;
};

export type AggregateActorImageArgsType = {
  where: ActorImageBoolExp;
  orderBy?: Array<ActorImageOrderBy>;
  distinctOn?: Array<ActorImageSelectColumn>;
  limit?: number;
  offset?: number;
};
