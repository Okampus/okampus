import type {
  GrantAllocateInsertInput,
  GrantAllocateOnConflict,
  GrantAllocateSetInput,
  GrantAllocateBoolExp,
  GrantAllocateOrderBy,
  GrantAllocateSelectColumn,
  GrantAllocatePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertGrantAllocateArgsType = {
  objects: Array<GrantAllocateInsertInput>;
  onConflict?: GrantAllocateOnConflict;
};

export type InsertOneGrantAllocateArgsType = {
  object: GrantAllocateInsertInput;
  onConflict?: GrantAllocateOnConflict;
};

export type UpdateGrantAllocateArgsType = {
  where: GrantAllocateBoolExp;
  _set: GrantAllocateSetInput;
};

export type DeleteGrantAllocateArgsType = {
  where: GrantAllocateBoolExp;
};

export type DeleteByPkGrantAllocateArgsType = {
  id: string;
};

export type UpdateByPkGrantAllocateArgsType = {
  pkColumns: GrantAllocatePkColumnsInput;
  _set: GrantAllocateSetInput;
};

export type FindGrantAllocateArgsType = {
  where: GrantAllocateBoolExp;
  orderBy?: Array<GrantAllocateOrderBy>;
  distinctOn?: Array<GrantAllocateSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkGrantAllocateArgsType = {
  id: string;
};

export type AggregateGrantAllocateArgsType = {
  where: GrantAllocateBoolExp;
  orderBy?: Array<GrantAllocateOrderBy>;
  distinctOn?: Array<GrantAllocateSelectColumn>;
  limit?: number;
  offset?: number;
};
