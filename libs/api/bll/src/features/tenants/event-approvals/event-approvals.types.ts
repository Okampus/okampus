import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertEventApprovalArgsType = {
  objects: Array<ValueTypes['EventApprovalInsertInput']>;
  onConflict?: ValueTypes['EventApprovalOnConflict'];
};

export type InsertOneEventApprovalArgsType = {
  object: ValueTypes['EventApprovalInsertInput'];
  onConflict?: ValueTypes['EventApprovalOnConflict'];
};

export type UpdateEventApprovalArgsType = {
  where: ValueTypes['EventApprovalBoolExp'];
  _set: ValueTypes['EventApprovalSetInput'];
};

export type DeleteEventApprovalArgsType = {
  where: ValueTypes['EventApprovalBoolExp'];
};

export type UpdateByPkEventApprovalArgsType = {
  pkColumns: ValueTypes['EventApprovalPkColumnsInput'];
  _set: ValueTypes['EventApprovalSetInput'];
};

export type FindEventApprovalArgsType = {
  where: ValueTypes['EventApprovalBoolExp'];
  orderBy?: Array<ValueTypes['EventApprovalOrderBy']>;
  distinctOn?: Array<ValueTypes['EventApprovalSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkEventApprovalArgsType = {
  id: string;
};

export type AggregateEventApprovalArgsType = {
  where: ValueTypes['EventApprovalBoolExp'];
  orderBy?: Array<ValueTypes['EventApprovalOrderBy']>;
  distinctOn?: Array<ValueTypes['EventApprovalSelectColumn']>;
  limit?: number;
  offset?: number;
};
