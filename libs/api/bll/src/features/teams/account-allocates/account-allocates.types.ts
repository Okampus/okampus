import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertAccountAllocateArgsType = {
  objects: Array<ValueTypes['AccountAllocateInsertInput']>;
  onConflict?: ValueTypes['AccountAllocateOnConflict'];
};

export type InsertOneAccountAllocateArgsType = {
  object: ValueTypes['AccountAllocateInsertInput'];
  onConflict?: ValueTypes['AccountAllocateOnConflict'];
};

export type UpdateAccountAllocateArgsType = {
  where: ValueTypes['AccountAllocateBoolExp'];
  _set: ValueTypes['AccountAllocateSetInput'];
};

export type DeleteAccountAllocateArgsType = {
  where: ValueTypes['AccountAllocateBoolExp'];
};

export type UpdateByPkAccountAllocateArgsType = {
  pkColumns: ValueTypes['AccountAllocatePkColumnsInput'];
  _set: ValueTypes['AccountAllocateSetInput'];
};

export type FindAccountAllocateArgsType = {
  where: ValueTypes['AccountAllocateBoolExp'];
  orderBy?: Array<ValueTypes['AccountAllocateOrderBy']>;
  distinctOn?: Array<ValueTypes['AccountAllocateSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkAccountAllocateArgsType = {
  id: string;
};

export type AggregateAccountAllocateArgsType = {
  where: ValueTypes['AccountAllocateBoolExp'];
  orderBy?: Array<ValueTypes['AccountAllocateOrderBy']>;
  distinctOn?: Array<ValueTypes['AccountAllocateSelectColumn']>;
  limit?: number;
  offset?: number;
};
